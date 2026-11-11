using DentalLounge.Domain.Common;
using DentalLounge.Domain.Entities;
using DentalLounge.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace DentalLounge.Persistence.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IConfiguration config,
        ILogger logger)
    {
        // 1. Seed Roles
        foreach (var roleName in RoleNames.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var roleDescription = roleName switch
                {
                    RoleNames.SuperAdmin => "Full administrative permissions across all modules, staff, and audit trails",
                    RoleNames.Admin => "Operational access to appointments, services & pricing, and media assets",
                    RoleNames.Helper => "Restricted staff access for reviewing patient appointments and statuses",
                    _ => ""
                };

                await roleManager.CreateAsync(new ApplicationRole(roleName, roleDescription));
                logger.LogInformation("Seeded Identity role: {Role}", roleName);
            }
        }

        // 2. Bootstrap Initial SuperAdmin
        var adminEmail = config["ADMIN_EMAIL"] ?? "admin@dentalloungemansehra.com";
        var adminPassword = config["ADMIN_PASSWORD"] ?? "Admin@DentalLounge2026!";
        var adminFullName = config["ADMIN_NAME"] ?? "Dental Lounge Administrator";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = adminFullName,
                EmailConfirmed = true,
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(adminUser, adminPassword);
            if (createResult?.Succeeded == true)
            {
                await userManager.AddToRoleAsync(adminUser, RoleNames.SuperAdmin);
                logger.LogInformation("Successfully bootstrapped initial SuperAdmin account: {Email}", adminEmail);
            }
            else
            {
                var errors = string.Join(", ", createResult?.Errors.Select(e => e.Description) ?? Array.Empty<string>());
                logger.LogError("Failed to create SuperAdmin account: {Errors}", errors);
            }
        }

        // 3. Idempotent Service Catalogue Seeding
        // CRITICAL RULE: If a service already exists, DO NOT OVERWRITE admin-customized pricing, texts, or images.
        var existingKeys = await context.Services.Select(s => s.StableKey).ToListAsync();
        var servicesToAdd = new List<Service>();

        foreach (var def in CanonicalServices.Catalog)
        {
            if (!existingKeys.Contains(def.StableKey))
            {
                var mode = def.InitialPriceDisplayMode switch
                {
                    "StartingFrom" => PriceDisplayMode.StartingFrom,
                    "ConsultationRequired" => PriceDisplayMode.ConsultationRequired,
                    "Unset" => PriceDisplayMode.Unset,
                    _ => PriceDisplayMode.Fixed
                };

                servicesToAdd.Add(new Service
                {
                    StableKey = def.StableKey,
                    DisplayOrder = def.DisplayOrder,
                    Name = def.Name,
                    Category = def.Category,
                    ShortDescription = def.ShortDescription,
                    FullDescription = def.FullDescription,
                    WhoItIsFor = def.WhoItIsFor,
                    GeneralBenefits = JsonSerializer.Serialize(def.GeneralBenefits),
                    PriceAmount = def.InitialPriceAmount,
                    CurrencyCode = "PKR",
                    PriceDisplayMode = mode,
                    PriceNote = def.InitialPriceNote,
                    ImageUrl = def.DefaultImageUrl,
                    ImageAltText = $"{def.Name} at Mansehra Dental Lounge",
                    IsPublished = true,
                    CreatedAtUtc = DateTime.UtcNow
                });
            }
        }

        if (servicesToAdd.Count > 0)
        {
            await context.Services.AddRangeAsync(servicesToAdd);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} canonical dental services into database.", servicesToAdd.Count);
        }
        else
        {
            logger.LogInformation("Service catalogue already populated. Existing clinic customizations preserved.");
        }
    }
}
