using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AzureOperationsAgents.Application.Services.Configuration.Interfaces;
using AzureOperationsAgents.Core.Models.Configuration;
using AzureOperationsAgents.Infrastructure.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.Application.Services.Configuration
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly IUserConfigurationRepository _userConfigRepository;
        private readonly IConfiguration _appConfiguration;

        public ConfigurationService(IUserConfigurationRepository userConfigRepository, IConfiguration appConfiguration)
        {
            _userConfigRepository = userConfigRepository;
            _appConfiguration = appConfiguration;
        }

        // CRUD Operations
        public async Task<UserConfiguration> GetConfigurationByIdAsync(int id)
        {
            return await _userConfigRepository.GetByIdAsync(id);
        }

        public async Task<UserConfiguration> GetDefaultConfigurationForUserAsync(string userId)
        {
            return await _userConfigRepository.GetDefaultForUserAsync(userId);
        }

        public async Task<List<UserConfiguration>> GetAllConfigurationsForUserAsync(string userId)
        {
            return await _userConfigRepository.GetAllForUserAsync(userId);
        }

        public async Task<UserConfiguration> CreateConfigurationAsync(UserConfiguration configuration)
        {
            // If this is the first configuration for this user, make it the default
            var existingConfigs = await _userConfigRepository.GetAllForUserAsync(configuration.UserId);
            if (existingConfigs.Count == 0)
            {
                configuration.IsDefault = true;
            }
            
            return await _userConfigRepository.AddAsync(configuration);
        }

        public async Task<UserConfiguration> UpdateConfigurationAsync(UserConfiguration configuration)
        {
            return await _userConfigRepository.UpdateAsync(configuration);
        }

        public async Task<bool> DeleteConfigurationAsync(int id)
        {
            return await _userConfigRepository.DeleteAsync(id);
        }

        public async Task<bool> SetAsDefaultConfigurationAsync(int id, string userId)
        {
            return await _userConfigRepository.SetAsDefaultAsync(id, userId);
        }

        // API Key and Settings Retrieval with fallback to app settings
        public async Task<string> GetOpenAIKeyForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.OpenAIKey) 
                ? config.OpenAIKey 
                : _appConfiguration["Values:OpenAIKey"];
        }

        public async Task<string> GetOpenAIEndpointForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.OpenAIEndpoint) 
                ? config.OpenAIEndpoint 
                : _appConfiguration["Values:OpenAIEndpoint"];
        }

        public async Task<string> GetOpenAIModelForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.OpenAIModel) 
                ? config.OpenAIModel 
                : _appConfiguration["Values:OpenAIModel"];
        }

        public async Task<string> GetOllamaServerForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.OllamaServer) 
                ? config.OllamaServer 
                : _appConfiguration["Values:OllamaServer"];
        }

        public async Task<string> GetOllamaModelForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.OllamaModel) 
                ? config.OllamaModel 
                : _appConfiguration["Values:OllamaModel"];
        }

        public async Task<string> GetSerperApiKeyForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.SerperApiKey) 
                ? config.SerperApiKey 
                : _appConfiguration["Values:SerperApiKey"];
        }

        public async Task<string> GetSerperApiEndpointForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            return !string.IsNullOrEmpty(config?.SerperApiEndpoint) 
                ? config.SerperApiEndpoint 
                : _appConfiguration["Values:SerperApiEndpoint"];
        }

        public async Task<Dictionary<string, string>> GetAllConfigurationValuesForUserAsync(string userId)
        {
            var config = await _userConfigRepository.GetDefaultForUserAsync(userId);
            var result = new Dictionary<string, string>
            {
                { "OpenAIKey", !string.IsNullOrEmpty(config?.OpenAIKey) ? config.OpenAIKey : _appConfiguration["Values:OpenAIKey"] },
                { "OpenAIEndpoint", !string.IsNullOrEmpty(config?.OpenAIEndpoint) ? config.OpenAIEndpoint : _appConfiguration["Values:OpenAIEndpoint"] },
                { "OpenAIModel", !string.IsNullOrEmpty(config?.OpenAIModel) ? config.OpenAIModel : _appConfiguration["Values:OpenAIModel"] },
                { "OllamaServer", !string.IsNullOrEmpty(config?.OllamaServer) ? config.OllamaServer : _appConfiguration["Values:OllamaServer"] },
                { "OllamaModel", !string.IsNullOrEmpty(config?.OllamaModel) ? config.OllamaModel : _appConfiguration["Values:OllamaModel"] },
                { "SerperApiKey", !string.IsNullOrEmpty(config?.SerperApiKey) ? config.SerperApiKey : _appConfiguration["Values:SerperApiKey"] },
                { "SerperApiEndpoint", !string.IsNullOrEmpty(config?.SerperApiEndpoint) ? config.SerperApiEndpoint : _appConfiguration["Values:SerperApiEndpoint"] }
            };

            return result;
        }
    }
}
