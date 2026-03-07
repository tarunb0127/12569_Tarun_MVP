using Relevantz.PhotoValidator.Common.Entities;
namespace Relevantz.PhotoValidator.Data.IRepository
{
    public interface IEmployeeRepository
    {
        Task<Employee?> GetByIdAsync(int employeeId);
        Task<Employee?> GetByEmployeeCompanyIdAsync(string employeeCompanyId);
        Task<List<Employee>> GetAllAsync();
        Task<List<Employee>> GetActiveEmployeesAsync();
        Task<Employee> CreateAsync(Employee employee);
        Task<Employee> UpdateAsync(Employee employee);
        Task<bool> DeleteAsync(int employeeId);
        Task<bool> EmployeeCompanyIdExistsAsync(string employeeCompanyId);
        Task<List<Employee>> GetByReportingManagerAsync(int reportingManagerEmployeeId);
        Task<string> GetNextEmployeeCompanyIdAsync();
    }
}
