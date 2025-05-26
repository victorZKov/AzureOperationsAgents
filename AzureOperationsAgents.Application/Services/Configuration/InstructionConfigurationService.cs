using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Models.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AzureOperationsAgents.Application.Services.Configuration;

public class InstructionConfigurationService : IInstructionConfigurationService
{
    private readonly ILogger<InstructionConfigurationService> _logger;
    private readonly IInstructionConfigurationRepository _repository;

    public InstructionConfigurationService(
        ILogger<InstructionConfigurationService> logger,
        IInstructionConfigurationRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }


    public async Task<InstructionConfiguration> GetInstructionConfigurationAsync(string key, CancellationToken cancellationToken = default)
    {
        var instructionConfig = await _repository.GetByKeyAsync(key);
        if (instructionConfig == null)
        {
            _logger.LogWarning("Instruction configuration with key '{Key}' not found.", key);
            throw new KeyNotFoundException($"Instruction configuration with key '{key}' not found.");
        }
        return instructionConfig;
    }

    public async Task<IEnumerable<InstructionConfiguration>> GetAllInstructionConfigurationsAsync(CancellationToken cancellationToken = default)
    {
        var instructionConfigs = await _repository.GetAllAsync();
        if (instructionConfigs == null || !instructionConfigs.Any())
        {
            _logger.LogWarning("No instruction configurations found.");
            return Enumerable.Empty<InstructionConfiguration>();
        }
        return instructionConfigs;
    }
}

