using AzureOperationsAgents.Core.Models.Classification;

namespace AzureOperationsAgents.Imfrastructure.Interfaces;

public interface IEventClassificationRepository
{
    Task SaveAsync(EventClassification classification);
    Task<EventClassification?> GetByIdAsync(string id);
    Task<List<EventClassification>> GetByCategoryAsync(string category);
    Task<List<EventClassification>> GetBySeverityAsync(string severity);
}