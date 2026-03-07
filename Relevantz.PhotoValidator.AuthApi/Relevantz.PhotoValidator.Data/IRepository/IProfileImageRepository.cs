using Relevantz.PhotoValidator.Common.Entities;
namespace Relevantz.PhotoValidator.Data.IRepository
{
    public interface IProfileImageRepository
    {
        Task<string> UploadImageAsync(int employeeId, byte[] imageData, string fileName, string contentType);
        Task<ProfileImageDocument?> GetImageAsync(int employeeId);
        Task<bool> DeleteImageAsync(int employeeId);
        Task<bool> UpdateImageAsync(int employeeId, byte[] imageData, string fileName, string contentType);
        Task<bool> ImageExistsAsync(int employeeId);
    }
}
