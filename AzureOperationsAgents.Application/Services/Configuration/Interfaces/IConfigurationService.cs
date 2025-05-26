using System.Collections.Generic;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Models.Configuration;

namespace AzureOperationsAgents.Application.Services.Configuration.Interfaces
{
    public interface IConfigurationService
    {
        // CRUD Operations
        Task<UserConfiguration> GetConfigurationByIdAsync(int id);
        Task<UserConfiguration> GetDefaultConfigurationForUserAsync(string userId);
        Task<List<UserConfiguration>> GetAllConfigurationsForUserAsync(string userId);
        Task<UserConfiguration> CreateConfigurationAsync(UserConfiguration configuration);
        Task<UserConfiguration> UpdateConfigurationAsync(UserConfiguration configuration);
        Task<bool> DeleteConfigurationAsync(int id);
        Task<bool> SetAsDefaultConfigurationAsync(int id, string userId);
        
        // API Key and Settings Retrieval
        Task<string> GetOpenAIKeyForUserAsync(string userId);
        Task<string> GetOpenAIEndpointForUserAsync(string userId);
        Task<string> GetOpenAIModelForUserAsync(string userId);
        Task<string> GetOllamaServerForUserAsync(string userId);
        Task<string> GetOllamaModelForUserAsync(string userId);
        Task<string> GetSerperApiKeyForUserAsync(string userId);
        Task<string> GetSerperApiEndpointForUserAsync(string userId);
        
        // Get all settings as a dictionary
        Task<Dictionary<string, string>> GetAllConfigurationValuesForUserAsync(string userId);
    }
}
