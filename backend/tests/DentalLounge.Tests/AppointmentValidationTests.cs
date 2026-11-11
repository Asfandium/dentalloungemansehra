using DentalLounge.Application.DTOs.Appointments;
using DentalLounge.Application.Validation;
using FluentAssertions;
using Xunit;

namespace DentalLounge.Tests;

public class AppointmentValidationTests
{
    private readonly CreateAppointmentRequestValidator _validator = new();

    private static CreateAppointmentRequest CreateValidRequest() => new()
    {
        Name = "Muhammad Ali",
        Gender = "Male",
        AppointmentDate = DateTime.UtcNow.AddDays(2).ToString("yyyy-MM-dd"),
        ContactNumber = "03482226228",
        Email = "patient@example.com",
        Message = "I would like a dental checkup and scaling.",
        Services = new List<string> { "General Routine Check-up", "Scaling & Polishing" }
    };

    [Fact]
    public async Task ValidAppointmentRequest_ShouldPassValidation()
    {
        var request = CreateValidRequest();
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("A")]
    public async Task MissingOrShortName_ShouldFailValidation(string invalidName)
    {
        var request = CreateValidRequest();
        request.Name = invalidName;
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Name));
    }

    [Theory]
    [InlineData("InvalidGender")]
    [InlineData("Alien")]
    [InlineData("")]
    public async Task InvalidGender_ShouldFailValidation(string gender)
    {
        var request = CreateValidRequest();
        request.Gender = gender;
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Gender));
    }

    [Fact]
    public async Task PastAppointmentDate_ShouldFailValidation()
    {
        var request = CreateValidRequest();
        request.AppointmentDate = DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd");
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.AppointmentDate));
    }

    [Theory]
    [InlineData("invalid-phone")]
    [InlineData("123")]
    [InlineData("abcdefghij")]
    public async Task InvalidContactNumber_ShouldFailValidation(string phone)
    {
        var request = CreateValidRequest();
        request.ContactNumber = phone;
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.ContactNumber));
    }

    [Fact]
    public async Task InvalidEmailFormat_ShouldFailValidation()
    {
        var request = CreateValidRequest();
        request.Email = "not-an-email";
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Email));
    }

    [Fact]
    public async Task NullOrEmptyEmail_ShouldPassValidation_BecauseEmailIsOptional()
    {
        var request = CreateValidRequest();
        request.Email = null;
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task EmptyServicesList_ShouldFailValidation()
    {
        var request = CreateValidRequest();
        request.Services = new List<string>();
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Services));
    }

    [Fact]
    public async Task UnknownServiceName_ShouldFailValidation()
    {
        var request = CreateValidRequest();
        request.Services = new List<string> { "Fake Imaginary Laser Surgery" };
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Services));
    }

    [Fact]
    public async Task DuplicateServiceSelections_ShouldFailValidation()
    {
        var request = CreateValidRequest();
        request.Services = new List<string> { "Filling", "Filling" };
        var result = await _validator.ValidateAsync(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Services));
    }
}
