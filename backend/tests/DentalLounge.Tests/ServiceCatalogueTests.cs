using DentalLounge.Domain.Common;
using DentalLounge.Domain.Entities;
using DentalLounge.Domain.Enums;
using DentalLounge.Persistence;
using DentalLounge.Persistence.Seed;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace DentalLounge.Tests;

public class ServiceCatalogueTests
{
    [Fact]
    public void CanonicalCatalogue_MustContainExactlyTenServices_InStrictOrder()
    {
        var catalog = CanonicalServices.Catalog;

        catalog.Should().HaveCount(10);

        // Verify order numbers 1 to 10
        for (int i = 0; i < 10; i++)
        {
            catalog[i].DisplayOrder.Should().Be(i + 1);
        }

        // Verify exact mandatory names
        catalog[0].Name.Should().Be("General Routine Check-up");
        catalog[1].Name.Should().Be("Extraction");
        catalog[2].Name.Should().Be("Filling");
        catalog[3].Name.Should().Be("Root Canal Treatment - RCT");
        catalog[4].Name.Should().Be("Scaling & Polishing");
        catalog[5].Name.Should().Be("Teeth Whitening");
        catalog[6].Name.Should().Be("Denture");
        catalog[7].Name.Should().Be("Bridges");
        catalog[8].Name.Should().Be("Implants");
        catalog[9].Name.Should().Be("Braces & Aligners");
    }

    [Fact]
    public async Task Seeding_MustBeIdempotent_AndNeverOverwriteAdminCustomizedPrices()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);

        // Pre-insert a service with an admin-customized price
        var customPrice = 9999m;
        var customService = new Service
        {
            StableKey = "filling",
            DisplayOrder = 3,
            Name = "Filling",
            Category = "Restorative",
            PriceAmount = customPrice,
            CurrencyCode = "PKR",
            PriceDisplayMode = PriceDisplayMode.Fixed,
            PriceNote = "Custom clinic price",
            ImageUrl = "https://custom.com/my-filling.jpg",
            ImageAltText = "Custom Filling",
            IsPublished = true,
            CreatedAtUtc = DateTime.UtcNow
        };
        context.Services.Add(customService);
        await context.SaveChangesAsync();

        // Run seed
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        var userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);
        userManagerMock.Setup(m => m.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(new ApplicationUser()); // Pretend admin already exists

        var roleStoreMock = new Mock<IRoleStore<ApplicationRole>>();
        var roleManagerMock = new Mock<RoleManager<ApplicationRole>>(roleStoreMock.Object, null!, null!, null!, null!);
        roleManagerMock.Setup(m => m.RoleExistsAsync(It.IsAny<string>()))
            .ReturnsAsync(true);

        var configMock = new Mock<IConfiguration>();

        await DbInitializer.SeedAsync(
            context,
            userManagerMock.Object,
            roleManagerMock.Object,
            configMock.Object,
            NullLogger.Instance);

        // Verify that custom price was NOT overwritten by seeding
        var serviceAfterSeed = await context.Services.FirstOrDefaultAsync(s => s.StableKey == "filling");
        serviceAfterSeed.Should().NotBeNull();
        serviceAfterSeed!.PriceAmount.Should().Be(customPrice);
        serviceAfterSeed.ImageUrl.Should().Be("https://custom.com/my-filling.jpg");

        // Verify total services now equals 10
        context.Services.Count().Should().Be(10);
    }
}
