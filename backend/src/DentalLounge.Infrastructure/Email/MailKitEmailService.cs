using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net;

namespace DentalLounge.Infrastructure.Email;

public class MailKitEmailService : IEmailService
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<MailKitEmailService> _logger;

    public MailKitEmailService(IOptions<SmtpSettings> settings, ILogger<MailKitEmailService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAppointmentNotificationAsync(Appointment appointment, CancellationToken ct = default)
    {
        if (!_settings.IsConfigured)
        {
            _logger.LogWarning("SMTP is not fully configured. Notification for appointment {AppointmentId} marked pending.", appointment.Id);
            throw new InvalidOperationException("SMTP settings are not configured. Please supply valid SMTP credentials.");
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        
        var recipient = !string.IsNullOrWhiteSpace(_settings.NotificationRecipientEmail)
            ? _settings.NotificationRecipientEmail
            : "dentalloungemansehra@gmail.com";
        message.To.Add(new MailboxAddress("Clinic Reception", recipient));

        var patientName = WebUtility.HtmlEncode(appointment.Name);
        var dateFormatted = appointment.AppointmentDate.ToString("yyyy-MM-dd");
        message.Subject = $"New Dental Appointment Request — {appointment.Name} — {dateFormatted}";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = BuildAppointmentEmailHtml(appointment)
        };
        message.Body = bodyBuilder.ToMessageBody();

        await SendMessageInternalAsync(message, ct);
        _logger.LogInformation("Appointment notification email successfully delivered for Appointment {AppointmentId} to {Recipient}",
            appointment.Id, recipient);
    }

    public async Task SendTestEmailAsync(string recipientEmail, CancellationToken ct = default)
    {
        if (!_settings.IsConfigured)
        {
            throw new InvalidOperationException("SMTP configuration is incomplete. Check SMTP_HOST, SMTP_USERNAME, and SMTP_PASSWORD.");
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(new MailboxAddress("Test Recipient", recipientEmail));
        message.Subject = "SMTP Test Verification — Mansehra Dental Lounge";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
<!DOCTYPE html>
<html>
<body style='font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;'>
  <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;'>
    <h2 style='color: #000075; margin-top: 0;'>Mansehra Dental Lounge</h2>
    <p>This is a test notification verifying that the MailKit SMTP gateway is functioning correctly with your configured Gmail credentials.</p>
    <p><strong>Timestamp (UTC):</strong> {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</p>
    <p><strong>Configured Sender:</strong> {WebUtility.HtmlEncode(_settings.FromEmail)}</p>
    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
    <p style='font-size: 12px; color: #64748b;'>Biotech Medical Center, opposite King Abdullah Teaching Hospital, Mansehra.</p>
  </div>
</body>
</html>"
        };
        message.Body = bodyBuilder.ToMessageBody();

        await SendMessageInternalAsync(message, ct);
        _logger.LogInformation("Test email successfully dispatched to {Recipient}", recipientEmail);
    }

    private async Task SendMessageInternalAsync(MimeMessage message, CancellationToken ct)
    {
        using var client = new SmtpClient();
        client.Timeout = 15000; // 15s timeout

        var secureSocketOption = _settings.Port == 465
            ? SecureSocketOptions.SslOnConnect
            : SecureSocketOptions.StartTls;

        try
        {
            await client.ConnectAsync(_settings.Host, _settings.Port, secureSocketOption, ct);
            if (!string.IsNullOrWhiteSpace(_settings.Username) && !string.IsNullOrWhiteSpace(_settings.Password))
            {
                var cleanPassword = _settings.Password.Replace(" ", "").Trim();
                await client.AuthenticateAsync(_settings.Username.Trim(), cleanPassword, ct);
            }
            await client.SendAsync(message, ct);
        }
        finally
        {
            if (client.IsConnected)
            {
                await client.DisconnectAsync(true, ct);
            }
        }
    }

    private static string BuildAppointmentEmailHtml(Appointment appointment)
    {
        var servicesHtml = appointment.Services != null && appointment.Services.Count > 0
            ? string.Join("", appointment.Services.Select(s => $"<li style='margin-bottom: 4px;'>{WebUtility.HtmlEncode(s.ServiceName)}</li>"))
            : "<li>General Consultation</li>";

        var patientEmail = !string.IsNullOrWhiteSpace(appointment.Email)
            ? $"<a href='mailto:{WebUtility.HtmlEncode(appointment.Email)}' style='color: #000075;'>{WebUtility.HtmlEncode(appointment.Email)}</a>"
            : "<span style='color: #64748b;'>Not provided</span>";

        var patientMessage = !string.IsNullOrWhiteSpace(appointment.Message)
            ? WebUtility.HtmlEncode(appointment.Message)
            : "<span style='color: #64748b;'>No message provided</span>";

        return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>New Dental Appointment Request</title>
</head>
<body style='font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;'>
  <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;'>
    
    <!-- Header -->
    <div style='background-color: #000075; padding: 24px; text-align: left;'>
      <h1 style='color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.5px;'>
        Mansehra Dental Lounge
      </h1>
      <p style='color: #bfdbfe; font-size: 13px; margin: 6px 0 0 0;'>
        New Patient Appointment Notification
      </p>
    </div>

    <!-- Content -->
    <div style='padding: 24px 28px;'>
      <div style='background-color: #eff6ff; border-left: 4px solid #000075; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;'>
        <p style='margin: 0; font-size: 14px; color: #1e3a8a; font-weight: 600;'>
          A new appointment request has been submitted through the website.
        </p>
      </div>

      <table style='width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;'>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 38%; font-weight: 500;'>Patient Name:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;'>{WebUtility.HtmlEncode(appointment.Name)}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;'>Gender:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;'>{WebUtility.HtmlEncode(appointment.Gender)}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;'>Appointment Date:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #000075; font-weight: 700; font-size: 15px;'>{appointment.AppointmentDate:dddd, MMMM dd, yyyy}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;'>Telephone / Mobile:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;'>
            <a href='tel:{WebUtility.HtmlEncode(appointment.ContactNumber)}' style='color: #000075; text-decoration: none;'>{WebUtility.HtmlEncode(appointment.ContactNumber)}</a>
          </td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;'>Email:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9;'>{patientEmail}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;'>Reference ID:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-family: monospace; font-size: 12px; color: #475569;'>{appointment.Id}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;'>Status:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9;'>
            <span style='background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 700;'>
              {appointment.Status}
            </span>
          </td>
        </tr>
      </table>

      <!-- Requested Services -->
      <div style='margin-bottom: 24px;'>
        <h3 style='font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 8px;'>
          Requested Services:
        </h3>
        <ul style='margin: 0; padding-left: 20px; color: #0f172a; font-size: 14px; font-weight: 600;'>
          {servicesHtml}
        </ul>
      </div>

      <!-- Patient Message -->
      <div style='margin-bottom: 24px;'>
        <h3 style='font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 8px;'>
          Patient Notes / Inquiries:
        </h3>
        <div style='background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.5;'>
          {patientMessage}
        </div>
      </div>

      <p style='font-size: 12px; color: #94a3b8; margin-top: 32px;'>
        Submitted on {appointment.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC via Mansehra Dental Lounge Online Booking.
      </p>
    </div>

    <!-- Footer -->
    <div style='background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; font-size: 12px; color: #64748b; text-align: center;'>
      Biotech Medical Center, Opposite King Abdullah Teaching Hospital, Mansehra.<br />
      Contact: 0348 2226228 • dentalloungemansehra@gmail.com
    </div>
  </div>
</body>
</html>";
    }
}
