using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Settings;
using DentalLounge.Domain.Common;
using DentalLounge.Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin}")]
public class SettingsController : ControllerBase
{
    private readonly SmtpSettings _smtpSettings;
    private readonly IEmailService _emailService;
    private readonly IAuditService _auditService;
    private readonly ILogger<SettingsController> _logger;

    public SettingsController(
        IOptions<SmtpSettings> smtpSettings,
        IEmailService emailService,
        IAuditService auditService,
        ILogger<SettingsController> logger)
    {
        _smtpSettings = smtpSettings.Value;
        _emailService = emailService;
        _auditService = auditService;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetSettings()
    {
        var dto = new ClinicSettingsDto
        {
            ClinicName = "Mansehra Dental Lounge",
            Address = "Biotech Medical Center, Opposite King Abdullah Teaching Hospital",
            City = "Mansehra",
            Phone = "0348 2226228",
            Email = "dentalloungemansehra@gmail.com",
            OpeningHours = "Monday – Saturday: 3:00 PM – 9:00 PM",
            GoogleMapsDirectUrl = "https://maps.app.goo.gl/XyaJotKZBxjn2Jyd7?g_st=aw",
            SmtpConfigured = _smtpSettings.IsConfigured,
            SmtpHost = _smtpSettings.Host,
            SmtpPort = _smtpSettings.Port,
            SmtpSender = _smtpSettings.FromEmail,
            NotificationRecipient = _smtpSettings.NotificationRecipientEmail
        };

        return Ok(ApiResponse<ClinicSettingsDto>.Ok(dto));
    }

    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RecipientEmail))
        {
            return BadRequest(ApiResponse<object>.Fail("Recipient email is required for the test delivery."));
        }

        try
        {
            await _emailService.SendTestEmailAsync(request.RecipientEmail.Trim(), ct);

            await _auditService.LogActionAsync(
                action: "SendTestEmail",
                entityName: "SmtpGateway",
                entityId: request.RecipientEmail.Trim(),
                details: $"Sent test verification email to {request.RecipientEmail}",
                ct: ct);

            return Ok(ApiResponse<object>.Ok(null, $"Verification email successfully sent to {request.RecipientEmail}. Check your inbox."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send test verification email.");
            return BadRequest(ApiResponse<object>.Fail($"SMTP test delivery failed: {ex.Message}"));
        }
    }
}
