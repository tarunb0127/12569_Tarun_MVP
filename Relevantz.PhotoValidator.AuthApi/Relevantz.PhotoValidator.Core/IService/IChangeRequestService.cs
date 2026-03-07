using Relevantz.PhotoValidator.Common.DTOs.Request;
using Relevantz.PhotoValidator.Common.DTOs.Response;

namespace Relevantz.PhotoValidator.Core.IService
{
    public interface IChangeRequestService
    {
        Task<ChangeRequestResponseDto> SubmitChangeRequestAsync(int userId, ChangeRequestDto request);
        Task<ChangeRequestResponseDto> ProcessChangeRequestAsync(ProcessChangeRequestDto request, int adminUserId);
        Task<List<ChangeRequestResponseDto>> GetPendingRequestsAsync();
        Task<List<ChangeRequestResponseDto>> GetUserChangeRequestsAsync(int userId);
        Task<List<ChangeRequestResponseDto>> GetAllChangeRequestsAsync();
        Task<bool> CancelChangeRequestAsync(int userId, int requestId);
        Task<ChangeRequestResponseDto?> HasPendingRequestAsync(int userId);
    }
}
