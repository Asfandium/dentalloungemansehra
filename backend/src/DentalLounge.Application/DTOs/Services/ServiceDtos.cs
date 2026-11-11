using DentalLounge.Domain.Enums;

namespace DentalLounge.Application.DTOs.Services;

public class PublicServiceDto
{
    public string Id { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string WhoItIsFor { get; set; } = string.Empty;
    public List<string> GeneralBenefits { get; set; } = new();
    public decimal? PriceAmount { get; set; }
    public string CurrencyCode { get; set; } = "PKR";
    public string PriceDisplayMode { get; set; } = "Fixed";
    public string PriceDisplay { get; set; } = string.Empty;
    public string? PriceNote { get; set; }
    public string Image { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
}

public class AdminServiceDto
{
    public Guid Id { get; set; }
    public string StableKey { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string WhoItIsFor { get; set; } = string.Empty;
    public List<string> GeneralBenefits { get; set; } = new();
    public decimal? PriceAmount { get; set; }
    public string CurrencyCode { get; set; } = "PKR";
    public PriceDisplayMode PriceDisplayMode { get; set; }
    public string PriceDisplayModeName => PriceDisplayMode.ToString();
    public string PriceDisplay { get; set; } = string.Empty;
    public string? PriceNote { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAltText { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}

public class UpdateServiceRequest
{
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string WhoItIsFor { get; set; } = string.Empty;
    public List<string> GeneralBenefits { get; set; } = new();
    public decimal? PriceAmount { get; set; }
    public string CurrencyCode { get; set; } = "PKR";
    public PriceDisplayMode PriceDisplayMode { get; set; }
    public string? PriceNote { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAltText { get; set; }
    public bool IsPublished { get; set; }
}
