using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Dashboard;
using DentalLounge.Domain.Common;
using DentalLounge.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin},{RoleNames.Helper}")]
public class DashboardController : ControllerBase
{
    private readonly IAppDbContext _context;

    public DashboardController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardStats(CancellationToken ct)
    {
        var total = await _context.Appointments.CountAsync(ct);
        var pending = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Pending, ct);
        var contacted = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Contacted, ct);
        var confirmed = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Confirmed, ct);
        var completed = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Completed, ct);
        var cancelled = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Cancelled, ct);

        var notificationFailures = await _context.NotificationOutboxes
            .CountAsync(n => n.Status == NotificationStatus.Failed, ct);

        var publishedServices = await _context.Services
            .CountAsync(s => s.IsPublished, ct);

        var recent = await _context.Appointments
            .Include(a => a.Services)
            .OrderByDescending(a => a.CreatedAtUtc)
            .Take(5)
            .Select(a => new RecentAppointmentDto
            {
                Id = a.Id,
                Name = a.Name,
                AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                ContactNumber = a.ContactNumber,
                Status = a.Status.ToString(),
                Services = a.Services.Select(s => s.ServiceName).ToList(),
                CreatedAtUtc = a.CreatedAtUtc
            })
            .ToListAsync(ct);

        var stats = new DashboardStatsDto
        {
            TotalAppointments = total,
            PendingAppointments = pending,
            ContactedAppointments = contacted,
            ConfirmedAppointments = confirmed,
            CompletedAppointments = completed,
            CancelledAppointments = cancelled,
            NotificationFailures = notificationFailures,
            TotalPublishedServices = publishedServices,
            RecentAppointments = recent
        };

        return Ok(ApiResponse<DashboardStatsDto>.Ok(stats));
    }
}
