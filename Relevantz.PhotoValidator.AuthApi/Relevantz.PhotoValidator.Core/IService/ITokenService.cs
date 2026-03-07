using Relevantz.PhotoValidator.Common.Entities;

namespace Relevantz.PhotoValidator.Core.IService
{
    public interface ITokenService
    {
        string GenerateAccessToken(Userauthentication user, string roleName);
        Task<string> GenerateRefreshTokenAsync(int userId, string? ipAddress);
        Task<bool> ValidateRefreshTokenAsync(string token);
        Task RevokeRefreshTokenAsync(string token);
        Task RevokeAllUserTokensAsync(int userId);
    }
}
