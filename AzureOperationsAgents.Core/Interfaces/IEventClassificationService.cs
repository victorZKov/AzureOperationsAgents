using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Core.Interfaces;

public interface IEventClassificationService
{
    Task<EventClassification> ClassifyEventAsync(EventClassification eventData);
    Task<EventClassification> GetClassificationAsync(string id);
    Task<List<EventClassification>> GetClassificationsByCategoryAsync(string category);
    Task<List<EventClassification>> GetClassificationsBySeverityAsync(string severity);
} 