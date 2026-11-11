using DentalLounge.Application.Common.Interfaces;
using DentalLounge.Application.Common.Models;
using DentalLounge.Application.DTOs.Services;
using DentalLounge.Application.Validation;
using DentalLounge.Domain.Common;
using DentalLounge.Domain.Entities;
using DentalLounge.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DentalLounge.Api.Controllers;

[ApiController]
[Route("api")]
public class ServicesController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly IAuditService _auditService;
    private readonly ILogger<ServicesController> _logger;

    public ServicesController(
        IAppDbContext context,
        IAuditService auditService,
        ILogger<ServicesController> logger)
    {
        _context = context;
        _auditService = auditService;
        _logger = logger;
    }

    /// <summary>
    /// Public endpoint: Returns published dental services in strict 1..10 order
    /// Equipped with Cache-Control headers so updates appear within 60s
    /// </summary>
    [HttpGet("services")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetPublicServices(CancellationToken ct)
    {
        Response.Headers.CacheControl = "public, max-age=60";

        var services = await _context.Services
            .AsNoTracking()
            .Where(s => s.IsPublished)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(ct);

        var dtoList = services.Select(s =>
        {
            var benefits = new List<string>();
            try
            {
                benefits = JsonSerializer.Deserialize<List<string>>(s.GeneralBenefits) ?? new List<string>();
            }
            catch
            {
                // Fallback
            }

            var priceDisplay = FormatPriceDisplay(s.PriceDisplayMode, s.PriceAmount, s.CurrencyCode);

            return new PublicServiceDto
            {
                Id = s.StableKey,
                OrderNumber = s.DisplayOrder,
                Name = s.Name,
                Category = s.Category,
                ShortDescription = s.ShortDescription,
                FullDescription = s.FullDescription,
                WhoItIsFor = s.WhoItIsFor,
                GeneralBenefits = benefits,
                PriceAmount = s.PriceAmount,
                CurrencyCode = s.CurrencyCode,
                PriceDisplayMode = s.PriceDisplayMode.ToString(),
                PriceDisplay = priceDisplay,
                PriceNote = s.PriceNote,
                Image = s.ImageUrl,
                ImageAlt = s.ImageAltText,
                IsPublished = s.IsPublished
            };
        }).ToList();

        return Ok(dtoList);
    }

    /// <summary>
    /// Admin endpoint: Returns all 10 services with complete administrative details
    /// </summary>
    [HttpGet("admin/services")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin}")]
    public async Task<IActionResult> GetAdminServices(CancellationToken ct)
    {
        var services = await _context.Services
            .AsNoTracking()
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(ct);

        var dtoList = services.Select(s =>
        {
            var benefits = new List<string>();
            try
            {
                benefits = JsonSerializer.Deserialize<List<string>>(s.GeneralBenefits) ?? new List<string>();
            }
            catch
            {
            }

            return new AdminServiceDto
            {
                Id = s.Id,
                StableKey = s.StableKey,
                DisplayOrder = s.DisplayOrder,
                Name = s.Name,
                Category = s.Category,
                ShortDescription = s.ShortDescription,
                FullDescription = s.FullDescription,
                WhoItIsFor = s.WhoItIsFor,
                GeneralBenefits = benefits,
                PriceAmount = s.PriceAmount,
                CurrencyCode = s.CurrencyCode,
                PriceDisplayMode = s.PriceDisplayMode,
                PriceDisplay = FormatPriceDisplay(s.PriceDisplayMode, s.PriceAmount, s.CurrencyCode),
                PriceNote = s.PriceNote,
                ImageUrl = s.ImageUrl,
                ImageAltText = s.ImageAltText,
                IsPublished = s.IsPublished,
                CreatedAtUtc = s.CreatedAtUtc,
                UpdatedAtUtc = s.UpdatedAtUtc
            };
        }).ToList();

        return Ok(ApiResponse<List<AdminServiceDto>>.Ok(dtoList));
    }

    /// <summary>
    /// Admin endpoint: Updates a service's pricing, descriptions, images, and publication state
    /// Preserves the canonical name and display order
    /// </summary>
    [HttpPut("admin/services/{id:guid}")]
    [Authorize(Roles = $"{RoleNames.SuperAdmin},{RoleNames.Admin}")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateServiceRequest request, CancellationToken ct)
    {
        var validator = new UpdateServiceRequestValidator();
        var validationResult = await validator.ValidateAsync(request, ct);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse<object>.Fail("Validation failed.", errors));
        }

        var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (service == null)
        {
            return NotFound(ApiResponse<object>.Fail("Service not found."));
        }

        // Apply changes
        service.ShortDescription = request.ShortDescription.Trim();
        service.FullDescription = request.FullDescription.Trim();
        service.WhoItIsFor = request.WhoItIsFor.Trim();
        service.GeneralBenefits = JsonSerializer.Serialize(request.GeneralBenefits ?? new List<string>());
        service.PriceAmount = request.PriceAmount;
        service.CurrencyCode = request.CurrencyCode.ToUpperInvariant().Trim();
        service.PriceDisplayMode = request.PriceDisplayMode;
        service.PriceNote = string.IsNullOrWhiteSpace(request.PriceNote) ? null : request.PriceNote.Trim();
        
        if (!string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            service.ImageUrl = request.ImageUrl.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.ImageAltText))
        {
            service.ImageAltText = request.ImageAltText.Trim();
        }

        service.IsPublished = request.IsPublished;
        service.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        await _auditService.LogActionAsync(
            action: "UpdateServicePricing",
            entityName: nameof(Service),
            entityId: id.ToString(),
            details: $"Updated service {service.Name}: Mode={service.PriceDisplayMode}, Amount={service.PriceAmount} {service.CurrencyCode}, Published={service.IsPublished}",
            ct: ct);

        return Ok(ApiResponse<object>.Ok(null, "Service details updated successfully."));
    }

    private static string FormatPriceDisplay(PriceDisplayMode mode, decimal? amount, string currency)
    {
        return mode switch
        {
            PriceDisplayMode.Unset => "Price on Inquiry",
            PriceDisplayMode.ConsultationRequired => "Consultation Required",
            PriceDisplayMode.StartingFrom when amount.HasValue => $"{currency} {amount.Value:N0} Starting",
            PriceDisplayMode.Fixed when amount.HasValue => $"{currency} {amount.Value:N0}",
            _ => "Price on Consultation"
        };
    }
}
