using DentalLounge.Domain.Enums;

namespace DentalLounge.Domain.Entities;

public class Appointment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateOnly AppointmentDate { get; set; }
    public string ContactNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Message { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<AppointmentService> Services { get; set; } = new List<AppointmentService>();
    public ICollection<NotificationOutbox> Notifications { get; set; } = new List<NotificationOutbox>();
}
