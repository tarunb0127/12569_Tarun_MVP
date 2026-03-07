using Relevantz.PhotoValidator.Common.Entities;
namespace Relevantz.PhotoValidator.Data.IRepository
{
    public interface IBulkOperationLogRepository
    {
        Task<Bulkoperationlog?> GetByIdAsync(int logId);
        Task<List<Bulkoperationlog>> GetByPerformedByUserIdAsync(int userId);
        Task<List<Bulkoperationlog>> GetByOperationTypeAsync(string operationType);
        Task<List<Bulkoperationlog>> GetAllAsync();
        Task<Bulkoperationlog> CreateAsync(Bulkoperationlog bulkOperationLog);
        Task<List<Bulkoperationlog>> GetRecentLogsAsync(int limit = 50);
    }
}
