using AzureOperationsAgents.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AzureOperationsAgents.Core.Interfaces
{
    public interface IModelService
    {
        Task<IEnumerable<ModelEntity>> GetModelsByEngineAsync(string engineName);
        Task<IEnumerable<ModelEntity>> GetAllModelsAsync();
    }
}

