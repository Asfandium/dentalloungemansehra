using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace DentalLounge.Infrastructure.Audit;

public class AuditService : IAuditService
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<AuditService> _logger;

    public AuditService(IAppDbContext context, ICurrentUserService currentUser, ILogger<AuditService> logger)
    {
        _context = context;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task LogActionAsync(
        string action,
        string entityName,
        string? entityId = null,
        string? details = null,
        CancellationToken ct = default)
    {
        try
        {
            var auditEntry = new AuditLog
            {
                UserId = _currentUser.UserId,
                UserEmail = _currentUser.UserEmail,
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Details = details,
                IpAddress = _currentUser.IpAddress,
                TimestampUtc = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditEntry);
            await _context.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to record audit log for action {Action} on {Entity}", action, entityName);
        }
    }
}
