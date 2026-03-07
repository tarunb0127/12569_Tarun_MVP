using Relevantz.PhotoValidator.Common.DTOs.Request;
using Relevantz.PhotoValidator.Common.DTOs.Response;

namespace Relevantz.PhotoValidator.Core.IService
{
    public interface IProfileService
    {
        Task<ProfileResponseDto> GetProfileByUserIdAsync(int userId);
        Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileRequestDto request);
    }
}
