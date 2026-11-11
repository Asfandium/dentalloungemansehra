namespace DentalLounge.Application.DTOs.Media;

public class MediaAssetDto
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string AltText { get; set; } = string.Empty;
    public string PublicUrl { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public Guid? ServiceId { get; set; }
    public string? ServiceName { get; set; }
}

public class UploadMediaResponse
{
    public Guid Id { get; set; }
    public string SafeStorageKey { get; set; } = string.Empty;
    public string PublicUrl { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public int? Width { get; set; }
    public int? Height { get; set; }
    public long FileSize { get; set; }
}
