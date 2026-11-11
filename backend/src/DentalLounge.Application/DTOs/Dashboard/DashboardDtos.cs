namespace DentalLounge.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalAppointments { get; set; }
    public int PendingAppointments { get; set; }
    public int ContactedAppointments { get; set; }
    public int ConfirmedAppointments { get; set; }
    public int CompletedAppointments { get; set; }
    public int CancelledAppointments { get; set; }
    public int NotificationFailures { get; set; }
    public int TotalPublishedServices { get; set; }
    public List<RecentAppointmentDto> RecentAppointments { get; set; } = new();
}

public class RecentAppointmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AppointmentDate { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<string> Services { get; set; } = new();
    public DateTime CreatedAtUtc { get; set; }
}
