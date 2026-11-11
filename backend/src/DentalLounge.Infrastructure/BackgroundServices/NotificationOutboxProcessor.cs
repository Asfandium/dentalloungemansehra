using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DentalLounge.Infrastructure.BackgroundServices;

public class NotificationOutboxProcessor : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<NotificationOutboxProcessor> _logger;
    private readonly TimeSpan _pollInterval = TimeSpan.FromSeconds(10);
    private const int MaxAttempts = 3;

    public NotificationOutboxProcessor(IServiceScopeFactory scopeFactory, ILogger<NotificationOutboxProcessor> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Outbox Processor started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingNotificationsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred in Notification Outbox background loop.");
            }

            try
            {
                await Task.Delay(_pollInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }

        _logger.LogInformation("Notification Outbox Processor stopped.");
    }

    private async Task ProcessPendingNotificationsAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        // Query pending or failed notifications with remaining retry attempts
        var pendingJobs = await db.NotificationOutboxes
            .Include(n => n.Appointment)
                .ThenInclude(a => a.Services)
            .Where(n => (n.Status == NotificationStatus.Pending || n.Status == NotificationStatus.Failed)
                     && n.AttemptCount < MaxAttempts)
            .OrderBy(n => n.CreatedAtUtc)
            .Take(10)
            .ToListAsync(ct);

        if (pendingJobs.Count == 0) return;

        foreach (var job in pendingJobs)
        {
            if (ct.IsCancellationRequested) break;

            job.AttemptCount++;
            job.LastAttemptUtc = DateTime.UtcNow;

            try
            {
                await emailService.SendAppointmentNotificationAsync(job.Appointment, ct);
                job.Status = NotificationStatus.Sent;
                job.SentAtUtc = DateTime.UtcNow;
                job.ErrorMessage = null;
                _logger.LogInformation("Successfully sent notification {NotificationId} for appointment {AppointmentId}.",
                    job.Id, job.AppointmentId);
            }
            catch (Exception ex)
            {
                job.Status = NotificationStatus.Failed;
                job.ErrorMessage = ex.Message.Length > 500 ? ex.Message[..500] : ex.Message;
                _logger.LogWarning("Failed to deliver notification {NotificationId} on attempt {Attempt}/{Max}: {Error}",
                    job.Id, job.AttemptCount, MaxAttempts, ex.Message);
            }

            await db.SaveChangesAsync(ct);
        }
    }
}
