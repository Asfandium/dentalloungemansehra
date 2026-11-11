using DentalLounge.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace DentalLounge.Infrastructure.Storage;

public class LocalStorageService : IFileStorageService
{
    private readonly string _uploadDirectory;
    private readonly ILogger<LocalStorageService> _logger;

    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/jpg", "image/png", "image/webp"
    };

    public LocalStorageService(ILogger<LocalStorageService> logger, string? uploadDirectory = null)
    {
        _logger = logger;
        _uploadDirectory = uploadDirectory ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        if (!Directory.Exists(_uploadDirectory))
        {
            Directory.CreateDirectory(_uploadDirectory);
        }
    }

    public async Task<(string safeStorageKey, string publicUrl, int? width, int? height)> SaveImageAsync(
        Stream fileStream,
        string originalFileName,
        string contentType,
        CancellationToken ct = default)
    {
        if (fileStream == null || fileStream.Length == 0)
        {
            throw new ArgumentException("Uploaded file stream is empty.");
        }

        if (fileStream.Length > 10 * 1024 * 1024) // 10MB limit
        {
            throw new ArgumentException("File size exceeds 10MB maximum limit.");
        }

        // Validate MIME type
        var ext = Path.GetExtension(originalFileName).ToLowerInvariant();
        if (ext is not (".jpg" or ".jpeg" or ".png" or ".webp"))
        {
            throw new ArgumentException("Only JPG, PNG, and WebP images are permitted.");
        }

        // Verify magic bytes (header validation)
        fileStream.Position = 0;
        var headerBytes = new byte[12];
        var bytesRead = await fileStream.ReadAsync(headerBytes.AsMemory(0, headerBytes.Length), ct);
        fileStream.Position = 0;

        if (!IsValidImageHeader(headerBytes, ext))
        {
            throw new ArgumentException("Uploaded file does not match a verified image signature.");
        }

        // Generate safe random storage key
        var safeKey = $"{Guid.NewGuid():N}{ext}";
        var destinationPath = Path.Combine(_uploadDirectory, safeKey);

        // Security check: ensure destination resides inside upload directory
        var fullPath = Path.GetFullPath(destinationPath);
        if (!fullPath.StartsWith(Path.GetFullPath(_uploadDirectory), StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Illegal file path traversal detected.");
        }

        await using (var outputStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            await fileStream.CopyToAsync(outputStream, ct);
        }

        var publicUrl = $"/uploads/{safeKey}";
        _logger.LogInformation("Successfully saved media asset {SafeKey} ({Size} bytes)", safeKey, fileStream.Length);

        return (safeKey, publicUrl, null, null);
    }

    public Task DeleteFileAsync(string safeStorageKey, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(safeStorageKey)) return Task.CompletedTask;

        var safeFileName = Path.GetFileName(safeStorageKey);
        var targetPath = Path.Combine(_uploadDirectory, safeFileName);

        if (File.Exists(targetPath))
        {
            try
            {
                File.Delete(targetPath);
                _logger.LogInformation("Deleted media asset {SafeKey}", safeFileName);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete physical media asset {SafeKey}", safeFileName);
            }
        }

        return Task.CompletedTask;
    }

    private static bool IsValidImageHeader(byte[] header, string extension)
    {
        if (header.Length < 4) return false;

        // JPEG: FF D8 FF
        if (header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
            return true;

        // PNG: 89 50 4E 47
        if (header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47)
            return true;

        // WebP: RIFF ... WEBP
        if (header.Length >= 12 &&
            header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
            header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50)
            return true;

        return false;
    }
}
