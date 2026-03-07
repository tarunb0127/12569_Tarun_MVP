using Relevantz.PhotoValidator.Common.Entities;
using Relevantz.PhotoValidator.Common.DTOs.Request;
using Relevantz.PhotoValidator.Common.DTOs.Response;

namespace Relevantz.PhotoValidator.Core.IService
{
    public interface IUserManagementService
    {
        Task<UserResponseDto> CreateUserAsync(CreateUserRequestDto request, int createdByUserId);
        Task<UserResponseDto> UpdateUserAsync(UpdateUserRequestDto request, int updatedByUserId);
        Task<UserResponseDto> GetUserByIdAsync(int userId);
        Task<List<UserResponseDto>> GetAllUsersAsync();
        Task DeactivateUserAsync(int userId);
        Task ActivateUserAsync(int userId);
        Task AssignRoleAndDepartmentAsync(AssignRoleDepartmentRequestDto request);
        Task<List<UserResponseDto>> GetEmployeesByManagerAsync(int managerId);
        Task<string> GetNextEmployeeCompanyIdAsync();
    }
}
