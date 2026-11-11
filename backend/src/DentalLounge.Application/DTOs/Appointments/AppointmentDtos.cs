using DentalLounge.Domain.Enums;

namespace DentalLounge.Application.DTOs.Appointments;

public class CreateAppointmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string AppointmentDate { get; set; } = string.Empty; // YYYY-MM-DD
    public string ContactNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Message { get; set; }
    public List<string> Services { get; set; } = new();
}

public class AppointmentCreatedResponse
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = "Appointment request received successfully.";
    public string AppointmentId { get; set; } = string.Empty;
}

public class AppointmentSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string AppointmentDate { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public AppointmentStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public List<string> Services { get; set; } = new();
    public DateTime CreatedAtUtc { get; set; }
    public NotificationStatus NotificationStatus { get; set; }
}

public class AppointmentDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string AppointmentDate { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Message { get; set; }
    public AppointmentStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
    public List<string> Services { get; set; } = new();
    public List<NotificationItemDto> Notifications { get; set; } = new();
}

public class NotificationItemDto
{
    public Guid Id { get; set; }
    public string Channel { get; set; } = "Email";
    public string Recipient { get; set; } = string.Empty;
    public NotificationStatus Status { get; set; }
    public int AttemptCount { get; set; }
    public DateTime? LastAttemptUtc { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? SentAtUtc { get; set; }
}

public class UpdateAppointmentStatusRequest
{
    public AppointmentStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class AppointmentFilterQuery
{
    public string? Search { get; set; }
    public AppointmentStatus? Status { get; set; }
    public DateOnly? FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } // "createdAt", "appointmentDate", "name"
    public bool SortDesc { get; set; } = true;
}
