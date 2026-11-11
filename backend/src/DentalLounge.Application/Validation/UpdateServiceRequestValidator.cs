using DentalLounge.Application.DTOs.Services;
using FluentValidation;

namespace DentalLounge.Application.Validation;

public class UpdateServiceRequestValidator : AbstractValidator<UpdateServiceRequest>
{
    public UpdateServiceRequestValidator()
    {
        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage("Short description is required.")
            .MaximumLength(300).WithMessage("Short description cannot exceed 300 characters.");

        RuleFor(x => x.FullDescription)
            .NotEmpty().WithMessage("Full description is required.")
            .MaximumLength(3000).WithMessage("Full description cannot exceed 3000 characters.");

        RuleFor(x => x.CurrencyCode)
            .NotEmpty().WithMessage("Currency code is required.")
            .Length(3).WithMessage("Currency code must be a 3-character ISO code.");

        When(x => x.PriceAmount.HasValue, () =>
        {
            RuleFor(x => x.PriceAmount!.Value)
                .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.")
                .LessThanOrEqualTo(1_000_000).WithMessage("Price amount exceeds clinic maximum threshold.");
        });

        When(x => !string.IsNullOrWhiteSpace(x.PriceNote), () =>
        {
            RuleFor(x => x.PriceNote)
                .MaximumLength(200).WithMessage("Price note cannot exceed 200 characters.");
        });
    }
}
