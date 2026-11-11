using DentalLounge.Application.DTOs.Auth;
using DentalLounge.Application.Validation;
using DentalLounge.Domain.Common;
using FluentAssertions;
using Xunit;

namespace DentalLounge.Tests;

public class SecurityTests
{
    private readonly CreateStaffRequestValidator _staffValidator = new();

    [Fact]
    public void SystemRoles_MustDefineSuperAdminAdminAndHelper()
    {
        RoleNames.All.Should().Contain(RoleNames.SuperAdmin);
        RoleNames.All.Should().Contain(RoleNames.Admin);
        RoleNames.All.Should().Contain(RoleNames.Helper);
        RoleNames.All.Should().HaveCount(3);
    }

    [Fact]
    public async Task CreateStaff_CannotAssignSuperAdminRole()
    {
        var request = new CreateStaffRequest
        {
            Email = "newadmin@dentallounge.com",
            FullName = "New Staff",
            Password = "Password123!",
            Role = RoleNames.SuperAdmin // Attempting privilege escalation
        };

        var result = await _staffValidator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Role));
    }

    [Theory]
    [InlineData("Admin")]
    [InlineData("Helper")]
    public async Task CreateStaff_AllowedForPermittedRoles(string role)
    {
        var request = new CreateStaffRequest
        {
            Email = "staff@dentallounge.com",
            FullName = "Permitted Staff",
            Password = "Password123!",
            Role = role
        };

        var result = await _staffValidator.ValidateAsync(request);
        result.IsValid.Should().BeTrue();
    }
}
