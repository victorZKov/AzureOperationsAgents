using AzureOperationsAgents.Core.Models.Configuration;

namespace AzureOperationsAgents.Core.Interfaces.Configuration;

public interface IInstructionConfigurationService
{
    Task<InstructionConfiguration> GetInstructionConfigurationAsync(string key, CancellationToken cancellationToken = default);
    Task<IEnumerable<InstructionConfiguration>> GetAllInstructionConfigurationsAsync(CancellationToken cancellationToken = default);
    
}