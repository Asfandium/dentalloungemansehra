namespace DentalLounge.Application.DTOs.Settings;

public class ClinicSettingsDto
{
    public string ClinicName { get; set; } = "Mansehra Dental Lounge";
    public string Address { get; set; } = "Biotech Medical Center, Opposite King Abdullah Teaching Hospital";
    public string City { get; set; } = "Mansehra";
    public string Phone { get; set; } = "0348 2226228";
    public string Email { get; set; } = "dentalloungemansehra@gmail.com";
    public string OpeningHours { get; set; } = "Monday – Saturday: 3:00 PM – 9:00 PM";
    public string GoogleMapsDirectUrl { get; set; } = "https://maps.app.goo.gl/XyaJotKZBxjn2Jyd7?g_st=aw";
    
    // Masked notification configuration status
    public bool SmtpConfigured { get; set; }
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; }
    public string SmtpSender { get; set; } = string.Empty;
    public string NotificationRecipient { get; set; } = string.Empty;
}

public class TestEmailRequest
{
    public string RecipientEmail { get; set; } = string.Empty;
}
