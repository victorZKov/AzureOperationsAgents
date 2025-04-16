using AzureOperationsAgents.Core.Models.Classification;

namespace AzureOperationsAgents.Core.Interfaces.Classification;

public interface IEventClassificationService
{
    Task<EventClassification> ClassifyEventAsync(EventClassification eventData);
    Task<EventClassification> GetClassificationAsync(string id);
    Task<List<EventClassification>> GetClassificationsByCategoryAsync(string category);
    Task<List<EventClassification>> GetClassificationsBySeverityAsync(string severity);
} 