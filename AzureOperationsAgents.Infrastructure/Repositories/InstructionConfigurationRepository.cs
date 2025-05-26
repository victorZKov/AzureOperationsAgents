using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Models.Configuration;
using Microsoft.EntityFrameworkCore;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class InstructionConfigurationRepository : IInstructionConfigurationRepository
    {
        private readonly AzureOperationsDbContext _context;

        public InstructionConfigurationRepository(AzureOperationsDbContext context)
        {
            _context = context;
        }

        public async Task<InstructionConfiguration> GetByKeyAsync(string key)
        {
            return await _context.InstructionConfigurations
                .FirstOrDefaultAsync(c => c.Key == key && c.IsActive);
        }

        public async Task<List<InstructionConfiguration>> GetAllAsync()
        {
            return await _context.InstructionConfigurations
                .Where(c => c.IsActive)
                .OrderBy(c => c.Key)
                .ToListAsync();
        }

        public async Task<InstructionConfiguration> AddAsync(InstructionConfiguration configuration)
        {
            configuration.CreatedAt = DateTime.UtcNow;
            configuration.UpdatedAt = DateTime.UtcNow;
            
            _context.InstructionConfigurations.Add(configuration);
            await _context.SaveChangesAsync();
            
            return configuration;
        }

        public async Task<InstructionConfiguration> UpdateAsync(InstructionConfiguration configuration)
        {
            var existingConfig = await _context.InstructionConfigurations
                .FirstOrDefaultAsync(c => c.Id == configuration.Id);

            if (existingConfig == null)
            {
                return null;
            }

            // Update the fields
            existingConfig.Key = configuration.Key;
            existingConfig.Value = configuration.Value;
            existingConfig.Description = configuration.Description;
            existingConfig.IsActive = configuration.IsActive;
            existingConfig.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            return existingConfig;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var configuration = await _context.InstructionConfigurations.FindAsync(id);
            if (configuration == null)
            {
                return false;
            }

            // Soft delete by setting IsActive to false
            configuration.IsActive = false;
            configuration.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
