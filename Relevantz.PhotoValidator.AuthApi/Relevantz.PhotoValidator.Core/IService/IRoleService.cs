using Relevantz.PhotoValidator.Common.Entities;
using Relevantz.PhotoValidator.Common.DTOs.Request;
using Relevantz.PhotoValidator.Common.DTOs.Response;

namespace Relevantz.PhotoValidator.Core.IService
{
    public interface IRoleService
    {
        Task<RoleResponseDto> CreateRoleAsync(CreateRoleRequestDto request);
        Task<RoleResponseDto> UpdateRoleAsync(UpdateRoleRequestDto request);
        Task<RoleResponseDto> GetRoleByIdAsync(int roleId);
        Task<List<RoleResponseDto>> GetAllRolesAsync();
        Task DeleteRoleAsync(int roleId);
    }
}
