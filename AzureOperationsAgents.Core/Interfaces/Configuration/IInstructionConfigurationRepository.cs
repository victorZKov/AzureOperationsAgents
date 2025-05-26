using AzureOperationsAgents.Core.Models.Configuration;

namespace AzureOperationsAgents.Core.Interfaces.Configuration
{
    public interface IInstructionConfigurationRepository
    {
        Task<InstructionConfiguration> GetByKeyAsync(string key);
        Task<List<InstructionConfiguration>> GetAllAsync();
        Task<InstructionConfiguration> AddAsync(InstructionConfiguration configuration);
        Task<InstructionConfiguration> UpdateAsync(InstructionConfiguration configuration);
        Task<bool> DeleteAsync(int id);
    }
}
