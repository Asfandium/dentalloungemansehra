using DentalLounge.Domain.Entities;

namespace DentalLounge.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendAppointmentNotificationAsync(Appointment appointment, CancellationToken ct = default);
    Task SendTestEmailAsync(string recipientEmail, CancellationToken ct = default);
}

public interface IFileStorageService
{
    Task<(string safeStorageKey, string publicUrl, int? width, int? height)> SaveImageAsync(Stream fileStream, string originalFileName, string contentType, CancellationToken ct = default);
    Task DeleteFileAsync(string safeStorageKey, CancellationToken ct = default);
}

public interface ITokenService
{
    string GenerateToken(ApplicationUser user, IList<string> roles);
}

public interface IAuditService
{
    Task LogActionAsync(string action, string entityName, string? entityId = null, string? details = null, CancellationToken ct = default);
}

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? UserEmail { get; }
    string? Role { get; }
    string? IpAddress { get; }
}
