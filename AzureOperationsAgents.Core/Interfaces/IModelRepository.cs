using AzureOperationsAgents.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AzureOperationsAgents.Core.Interfaces
{
    public interface IModelRepository
    {
        Task<IEnumerable<ModelEntity>> GetModelsByEngineAsync(string engineName);
        Task<IEnumerable<ModelEntity>> GetAllModelsAsync();
    }
}

