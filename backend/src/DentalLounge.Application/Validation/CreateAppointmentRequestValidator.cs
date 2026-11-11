using DentalLounge.Application.DTOs.Appointments;
using DentalLounge.Domain.Common;
using FluentValidation;
using System.Text.RegularExpressions;

namespace DentalLounge.Application.Validation;

public class CreateAppointmentRequestValidator : AbstractValidator<CreateAppointmentRequest>
{
    private static readonly Regex PhoneRegex = new(
        @"^([+]?[0-9]{1,4}[-\s]?)?[0-9]{7,15}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    private static readonly HashSet<string> AllowedGenders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Male", "Female", "Prefer not to say"
    };

    public CreateAppointmentRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Full name is required.")
            .MinimumLength(2).WithMessage("Full name must be at least 2 characters.")
            .MaximumLength(100).WithMessage("Full name must not exceed 100 characters.");

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage("Gender is required.")
            .Must(g => AllowedGenders.Contains(g.Trim()))
            .WithMessage("Gender must be 'Male', 'Female', or 'Prefer not to say'.");

        RuleFor(x => x.AppointmentDate)
            .NotEmpty().WithMessage("Appointment date is required.")
            .Must(BeValidDate)
            .WithMessage("Appointment date must be a valid date formatted as YYYY-MM-DD.")
            .Must(BeFutureOrToday)
            .WithMessage("Appointment date cannot be in the past.");

        RuleFor(x => x.ContactNumber)
            .NotEmpty().WithMessage("Contact number is required.")
            .Must(phone => !string.IsNullOrWhiteSpace(phone) && PhoneRegex.IsMatch(phone.Trim()))
            .WithMessage("Please provide a valid telephone number format.");

        When(x => !string.IsNullOrWhiteSpace(x.Email), () =>
        {
            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Please provide a valid email address.")
                .MaximumLength(150).WithMessage("Email must not exceed 150 characters.");
        });

        When(x => !string.IsNullOrWhiteSpace(x.Message), () =>
        {
            RuleFor(x => x.Message)
                .MaximumLength(1000).WithMessage("Message cannot exceed 1000 characters.");
        });

        RuleFor(x => x.Services)
            .NotNull().WithMessage("At least one dental service must be selected.")
            .Must(s => s != null && s.Count > 0).WithMessage("Please select at least one dental service.")
            .Must(s => s != null && s.Count <= 10).WithMessage("Cannot select more than 10 services.")
            .Must(HaveNoDuplicates).WithMessage("Duplicate services are not allowed in a single appointment request.")
            .Must(ContainOnlyAllowedServices).WithMessage("One or more selected services are not in the official clinic catalogue.");
    }

    private static bool BeValidDate(string dateStr)
    {
        return DateOnly.TryParse(dateStr, out _);
    }

    private static bool BeFutureOrToday(string dateStr)
    {
        if (DateOnly.TryParse(dateStr, out var parsed))
        {
            return parsed >= DateOnly.FromDateTime(DateTime.UtcNow.Date);
        }
        return false;
    }

    private static bool HaveNoDuplicates(List<string> services)
    {
        if (services == null) return true;
        return services.Distinct(StringComparer.OrdinalIgnoreCase).Count() == services.Count;
    }

    private static bool ContainOnlyAllowedServices(List<string> services)
    {
        if (services == null) return true;
        var allowedSet = new HashSet<string>(CanonicalServices.Names, StringComparer.OrdinalIgnoreCase);
        return services.All(s => allowedSet.Contains(s.Trim()));
    }
}
