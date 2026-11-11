using DentalLounge.Domain.Enums;

namespace DentalLounge.Domain.Entities;

public class Service
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string StableKey { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "Preventative";
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string WhoItIsFor { get; set; } = string.Empty;
    public string GeneralBenefits { get; set; } = "[]"; // JSON array of string benefits
    public decimal? PriceAmount { get; set; }
    public string CurrencyCode { get; set; } = "PKR";
    public PriceDisplayMode PriceDisplayMode { get; set; } = PriceDisplayMode.Fixed;
    public string? PriceNote { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAltText { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}
