using Relevantz.PhotoValidator.Common.Entities;
namespace Relevantz.PhotoValidator.Data.IRepository
{
    public interface IRefreshTokenRepository
    {
        Task<Refreshtoken?> GetByIdAsync(int tokenId);
        Task<Refreshtoken?> GetByTokenAsync(string token);
        Task<List<Refreshtoken>> GetByUserIdAsync(int userId);
        Task<Refreshtoken> CreateAsync(Refreshtoken refreshToken);
        Task<Refreshtoken> UpdateAsync(Refreshtoken refreshToken);
        Task RevokeTokenAsync(string token);
        Task RevokeAllUserTokensAsync(int userId);
        Task DeleteExpiredTokensAsync();
    }
}
