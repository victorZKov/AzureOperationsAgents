using AzureOperationsAgents.Core.Entities;
using AzureOperationsAgents.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AzureOperationsAgents.Application.Services
{
    public class ModelService : IModelService
    {
        private readonly IModelRepository _modelRepository;

        public ModelService(IModelRepository modelRepository)
        {
            _modelRepository = modelRepository;
        }

        public Task<IEnumerable<ModelEntity>> GetAllModelsAsync()
        {
            return _modelRepository.GetAllModelsAsync();
        }

        public Task<IEnumerable<ModelEntity>> GetModelsByEngineAsync(string engineName)
        {
            return _modelRepository.GetModelsByEngineAsync(engineName);
        }
    }
}

