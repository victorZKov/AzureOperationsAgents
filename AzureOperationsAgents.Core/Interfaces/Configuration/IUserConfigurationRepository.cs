using AzureOperationsAgents.Core.Models.Configuration;

namespace AzureOperationsAgents.Core.Interfaces.Configuration
{
    public interface IUserConfigurationRepository
    {
        Task<UserConfiguration> GetByIdAsync(int id);
        Task<UserConfiguration> GetDefaultForUserAsync(string userId);
        Task<List<UserConfiguration>> GetAllForUserAsync(string userId);
        Task<UserConfiguration> AddAsync(UserConfiguration configuration);
        Task<UserConfiguration> UpdateAsync(UserConfiguration configuration);
        Task<bool> DeleteAsync(int id);
        Task<bool> SetAsDefaultAsync(int id, string userId);
    }
}
