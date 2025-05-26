using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Models.Configuration;
using AzureOperationsAgents.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class UserConfigurationRepository : IUserConfigurationRepository
    {
        private readonly AzureOperationsDbContext _context;

        public UserConfigurationRepository(AzureOperationsDbContext context)
        {
            _context = context;
        }

        public async Task<UserConfiguration> GetByIdAsync(int id)
        {
            return await _context.UserConfigurations
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
        }

        public async Task<UserConfiguration> GetDefaultForUserAsync(string userId)
        {
            // First try to get the configuration marked as default
            var defaultConfig = await _context.UserConfigurations
                .FirstOrDefaultAsync(c => c.UserId == userId && c.IsDefault && c.IsActive);

            // If no default is found, return the first active one for the user
            if (defaultConfig == null)
            {
                defaultConfig = await _context.UserConfigurations
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.IsActive);
            }

            return defaultConfig;
        }

        public async Task<List<UserConfiguration>> GetAllForUserAsync(string userId)
        {
            return await _context.UserConfigurations
                .Where(c => c.UserId == userId && c.IsActive)
                .OrderByDescending(c => c.IsDefault)
                .ThenByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        public async Task<UserConfiguration> AddAsync(UserConfiguration configuration)
        {
            // If this is marked as default, make sure to clear other defaults for this user
            if (configuration.IsDefault)
            {
                await ClearDefaultFlagForUserAsync(configuration.UserId);
            }

            configuration.CreatedAt = DateTime.UtcNow;
            configuration.UpdatedAt = DateTime.UtcNow;
            
            _context.UserConfigurations.Add(configuration);
            await _context.SaveChangesAsync();
            
            return configuration;
        }

        public async Task<UserConfiguration> UpdateAsync(UserConfiguration configuration)
        {
            var existingConfig = await _context.UserConfigurations
                .FirstOrDefaultAsync(c => c.Id == configuration.Id);

            if (existingConfig == null)
            {
                return null;
            }

            // If setting this to default, clear other defaults for this user
            if (configuration.IsDefault && !existingConfig.IsDefault)
            {
                await ClearDefaultFlagForUserAsync(configuration.UserId);
            }

            // Update the fields
            existingConfig.OpenAIKey = configuration.OpenAIKey;
            existingConfig.OpenAIEndpoint = configuration.OpenAIEndpoint;
            existingConfig.OpenAIModel = configuration.OpenAIModel;
            existingConfig.OllamaServer = configuration.OllamaServer;
            existingConfig.OllamaModel = configuration.OllamaModel;
            existingConfig.SerperApiKey = configuration.SerperApiKey;
            existingConfig.SerperApiEndpoint = configuration.SerperApiEndpoint;
            existingConfig.IsDefault = configuration.IsDefault;
            existingConfig.IsActive = configuration.IsActive;
            existingConfig.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            return existingConfig;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var config = await _context.UserConfigurations
                .FirstOrDefaultAsync(c => c.Id == id);

            if (config == null)
            {
                return false;
            }

            // Soft delete by marking as inactive
            config.IsActive = false;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetAsDefaultAsync(int id, string userId)
        {
            var config = await _context.UserConfigurations
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (config == null)
            {
                return false;
            }

            // Clear default flag on other configs
            await ClearDefaultFlagForUserAsync(userId);

            // Set this one as default
            config.IsDefault = true;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task ClearDefaultFlagForUserAsync(string userId)
        {
            var defaultConfigs = await _context.UserConfigurations
                .Where(c => c.UserId == userId && c.IsDefault && c.IsActive)
                .ToListAsync();

            foreach (var config in defaultConfigs)
            {
                config.IsDefault = false;
                config.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }
}
