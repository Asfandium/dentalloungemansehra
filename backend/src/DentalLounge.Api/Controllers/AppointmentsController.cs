using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Appointments;
using DentalLounge.Application.Validation;
using DentalLounge.Domain.Common;
using DentalLounge.Domain.Entities;
using DentalLounge.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly IAuditService _auditService;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(
        IAppDbContext context,
        IAuditService auditService,
        ILogger<AppointmentsController> logger)
    {
        _context = context;
        _auditService = auditService;
        _logger = logger;
    }

    /// <summary>
    /// Public endpoint for patients submitting appointment requests
    /// Matches the existing frontend contract POST /api/appointments
    /// </summary>
    [HttpPost("appointments")]
    [EnableRateLimiting("PublicApi")]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request, CancellationToken ct)
    {
        // Server-side validation via FluentValidation
        var validator = new CreateAppointmentRequestValidator();
        var validationResult = await validator.ValidateAsync(request, ct);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(new
            {
                success = false,
                message = "Validation failed. Please correct the highlighted errors.",
                errors
            });
        }

        // Parse date
        var appointmentDate = DateOnly.Parse(request.AppointmentDate.Trim());

        // Create appointment entity with default status Pending
        var appointment = new Appointment
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Gender = request.Gender.Trim(),
            AppointmentDate = appointmentDate,
            ContactNumber = request.ContactNumber.Trim(),
            Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
            Message = string.IsNullOrWhiteSpace(request.Message) ? null : request.Message.Trim(),
            Status = AppointmentStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };

        // Attach requested services
        var distinctServices = request.Services
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var serviceName in distinctServices)
        {
            var dbService = await _context.Services
                .FirstOrDefaultAsync(s => s.Name.ToLower() == serviceName.ToLower(), ct);

            appointment.Services.Add(new AppointmentService
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointment.Id,
                ServiceName = serviceName,
                ServiceId = dbService?.Id
            });
        }

        // Transactional outbox notification record
        var outboxNotification = new NotificationOutbox
        {
            Id = Guid.NewGuid(),
            AppointmentId = appointment.Id,
            Channel = "Email",
            //Recipient = "asfandium.1@gmail.com",
            Recipient = "dentalloungemansehra@gmail.com",
            Subject = $"New Dental Appointment Request — {appointment.Name} — {appointment.AppointmentDate:yyyy-MM-dd}",
            BodyHtml = "", // populated at send time
            Status = NotificationStatus.Pending,
            AttemptCount = 0,
            CreatedAtUtc = DateTime.UtcNow
        };

        appointment.Notifications.Add(outboxNotification);

        // Transactional save to database
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync(ct);

        _logger.LogInformation("Successfully persisted new appointment {AppointmentId} for {PatientName}",
            appointment.Id, appointment.Name);

        // Return HTTP 201 with documented response contract
        return StatusCode(StatusCodes.Status201Created, new AppointmentCreatedResponse
        {
            Success = true,
            Message = "Appointment request received successfully.",
            AppointmentId = appointment.Id.ToString()
        });
    }

    /// <summary>
    /// Admin endpoint: List, search, filter, and paginate appointments
    /// </summary>
    [HttpGet("admin/appointments")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin},{RoleNames.Helper}")]
    public async Task<IActionResult> GetAppointments([FromQuery] AppointmentFilterQuery query, CancellationToken ct)
    {
        var dbQuery = _context.Appointments
            .Include(a => a.Services)
            .Include(a => a.Notifications)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            dbQuery = dbQuery.Where(a => a.Name.ToLower().Contains(search) || a.ContactNumber.Contains(search));
        }

        if (query.Status.HasValue)
        {
            dbQuery = dbQuery.Where(a => a.Status == query.Status.Value);
        }

        if (query.FromDate.HasValue)
        {
            dbQuery = dbQuery.Where(a => a.AppointmentDate >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            dbQuery = dbQuery.Where(a => a.AppointmentDate <= query.ToDate.Value);
        }

        // Sorting
        dbQuery = query.SortBy?.ToLower() switch
        {
            "appointmentdate" => query.SortDesc ? dbQuery.OrderByDescending(a => a.AppointmentDate) : dbQuery.OrderBy(a => a.AppointmentDate),
            "name" => query.SortDesc ? dbQuery.OrderByDescending(a => a.Name) : dbQuery.OrderBy(a => a.Name),
            _ => query.SortDesc ? dbQuery.OrderByDescending(a => a.CreatedAtUtc) : dbQuery.OrderBy(a => a.CreatedAtUtc),
        };

        var totalCount = await dbQuery.CountAsync(ct);
        var pageNumber = query.PageNumber > 0 ? query.PageNumber : 1;
        var pageSize = query.PageSize > 0 && query.PageSize <= 50 ? query.PageSize : 10;

        var items = await dbQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AppointmentSummaryDto
            {
                Id = a.Id,
                Name = a.Name,
                Gender = a.Gender,
                AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                ContactNumber = a.ContactNumber,
                Email = a.Email,
                Status = a.Status,
                Services = a.Services.Select(s => s.ServiceName).ToList(),
                CreatedAtUtc = a.CreatedAtUtc,
                NotificationStatus = a.Notifications.OrderByDescending(n => n.CreatedAtUtc).Select(n => n.Status).FirstOrDefault()
            })
            .ToListAsync(ct);

        return Ok(ApiResponse<PagedResult<AppointmentSummaryDto>>.Ok(
            new PagedResult<AppointmentSummaryDto>(items, totalCount, pageNumber, pageSize)));
    }

    /// <summary>
    /// Admin endpoint: View individual appointment details
    /// </summary>
    [HttpGet("admin/appointments/{id:guid}")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin},{RoleNames.Helper}")]
    public async Task<IActionResult> GetAppointmentById(Guid id, CancellationToken ct)
    {
        var a = await _context.Appointments
            .Include(a => a.Services)
            .Include(a => a.Notifications)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        if (a == null)
        {
            return NotFound(ApiResponse<object>.Fail("Appointment not found."));
        }

        var dto = new AppointmentDetailDto
        {
            Id = a.Id,
            Name = a.Name,
            Gender = a.Gender,
            AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
            ContactNumber = a.ContactNumber,
            Email = a.Email,
            Message = a.Message,
            Status = a.Status,
            CreatedAtUtc = a.CreatedAtUtc,
            UpdatedAtUtc = a.UpdatedAtUtc,
            Services = a.Services.Select(s => s.ServiceName).ToList(),
            Notifications = a.Notifications.Select(n => new NotificationItemDto
            {
                Id = n.Id,
                Channel = n.Channel,
                Recipient = n.Recipient,
                Status = n.Status,
                AttemptCount = n.AttemptCount,
                LastAttemptUtc = n.LastAttemptUtc,
                ErrorMessage = n.ErrorMessage,
                CreatedAtUtc = n.CreatedAtUtc,
                SentAtUtc = n.SentAtUtc
            }).ToList()
        };

        return Ok(ApiResponse<AppointmentDetailDto>.Ok(dto));
    }

    /// <summary>
    /// Admin endpoint: Update appointment status (Pending, Contacted, Confirmed, Completed, Cancelled)
    /// </summary>
    [HttpPatch("admin/appointments/{id:guid}/status")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin},{RoleNames.Helper}")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateAppointmentStatusRequest request, CancellationToken ct)
    {
        var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (appointment == null)
        {
            return NotFound(ApiResponse<object>.Fail("Appointment not found."));
        }

        var previousStatus = appointment.Status;
        appointment.Status = request.Status;
        appointment.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        await _auditService.LogActionAsync(
            action: "UpdateStatus",
            entityName: nameof(Appointment),
            entityId: id.ToString(),
            details: $"Changed status from {previousStatus} to {request.Status}. Notes: {request.Notes}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(new { appointment.Id, appointment.Status }, "Status updated successfully."));
    }

    /// <summary>
    /// Admin endpoint: Delete an appointment (SuperAdmin & Admin only)
    /// </summary>
    [HttpDelete("admin/appointments/{id:guid}")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin}")]
    public async Task<IActionResult> DeleteAppointment(Guid id, CancellationToken ct)
    {
        var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (appointment == null)
        {
            return NotFound(ApiResponse<object>.Fail("Appointment not found."));
        }

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync(ct);

        await _auditService.LogActionAsync(
            action: "DeleteAppointment",
            entityName: nameof(Appointment),
            entityId: id.ToString(),
            details: $"Deleted appointment for {appointment.Name}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Appointment record successfully removed."));
    }

    /// <summary>
    /// Admin endpoint: Retry email notification for a specific appointment
    /// </summary>
    [HttpPost("admin/appointments/{id:guid}/retry-notification")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin}")]
    public async Task<IActionResult> RetryNotification(Guid id, CancellationToken ct)
    {
        var outbox = await _context.NotificationOutboxes
            .Where(n => n.AppointmentId == id)
            .OrderByDescending(n => n.CreatedAtUtc)
            .FirstOrDefaultAsync(ct);

        if (outbox == null)
        {
            // Create a new outbox entry if none exists
            outbox = new NotificationOutbox
            {
                Id = Guid.NewGuid(),
                AppointmentId = id,
                Channel = "Email",
                //Recipient = "asfandium.1@gmail.com",
                Recipient = "dentalloungemansehra@gmail.com",
                Status = NotificationStatus.Pending,
                AttemptCount = 0,
                CreatedAtUtc = DateTime.UtcNow
            };
            _context.NotificationOutboxes.Add(outbox);
        }
        else
        {
            outbox.Status = NotificationStatus.Pending;
            outbox.AttemptCount = 0;
            outbox.ErrorMessage = null;
        }

        await _context.SaveChangesAsync(ct);

        await _auditService.LogActionAsync(
            action: "RetryNotification",
            entityName: nameof(NotificationOutbox),
            entityId: outbox.Id.ToString(),
            details: $"Reset notification retry attempt for appointment {id}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Notification queued for re-dispatch."));
    }
}
