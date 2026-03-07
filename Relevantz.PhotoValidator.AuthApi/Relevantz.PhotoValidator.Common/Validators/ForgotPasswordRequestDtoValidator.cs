using FluentValidation;
using Relevantz.PhotoValidator.Common.DTOs.Request;
namespace Relevantz.PhotoValidator.Common.Validators
{
    public class ForgotPasswordRequestDtoValidator : AbstractValidator<ForgotPasswordRequestDto>
    {
        public ForgotPasswordRequestDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");
        }
    }
}
