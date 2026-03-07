using FluentValidation;
using Relevantz.PhotoValidator.Common.DTOs.Request;
using Relevantz.PhotoValidator.Common.Constants;
using static Relevantz.PhotoValidator.Common.Constants.Constants;
namespace Relevantz.PhotoValidator.Common.Validators
{
    public class VerifyOtpRequestDtoValidator : AbstractValidator<VerifyOtpRequestDto>
    {
        public VerifyOtpRequestDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");
            RuleFor(x => x.OtpCode)
                .NotEmpty().WithMessage("OTP code is required")
                .Length(4, 10).WithMessage("OTP must be between 4 and 10 characters");
            RuleFor(x => x.OtpType)
                .NotEmpty().WithMessage("OTP type is required")
                .Must(type => new[] 
                { 
                    OtpTypeConstants.PasswordReset,
                    OtpTypeConstants.EmailVerification,
                    OtpTypeConstants.TwoFactorAuthentication,
                    OtpTypeConstants.AccountActivation,
                    OtpTypeConstants.FirstLogin,
                    OtpTypes.Login2FA,
                    OtpTypes.ForgotPassword
                }.Contains(type))
                .WithMessage("Invalid OTP type");
        }
    }
}
