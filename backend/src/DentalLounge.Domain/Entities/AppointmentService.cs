namespace DentalLounge.Domain.Entities;

public class AppointmentService
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;
    public string ServiceName { get; set; } = string.Empty;
    public Guid? ServiceId { get; set; }
    public Service? Service { get; set; }
}
