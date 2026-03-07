using Relevantz.PhotoValidator.Common.Entities;

namespace Relevantz.PhotoValidator.Core.IService
{
    public interface IOtpService
    {
        Task<Otp> GenerateOtpAsync(string email, string otpType);
        Task<bool> VerifyOtpAsync(string email, string otpCode, string otpType);
        Task<bool> ResendOtpAsync(string email, string otpType);
        Task CleanupExpiredOtpsAsync();
    }
}
