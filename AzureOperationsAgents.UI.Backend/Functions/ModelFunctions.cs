using AzureOperationsAgents.Core.Helpers; // Added for JwtUtils
using AzureOperationsAgents.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Http;

namespace AzureOperationsAgents.UI.Backend.Functions
{
    public class ModelFunctions
    {
        private readonly ILogger<ModelFunctions> _logger;
        private readonly IModelService _modelService;

        public ModelFunctions(ILogger<ModelFunctions> logger, IModelService modelService)
        {
            _logger = logger;
            _modelService = modelService;
        }

        [Function("GetModels")]
        public async Task<IActionResult> GetModels(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "models/{engineName?}")] HttpRequestData req,
            string? engineName)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req); // Added token check
            if (string.IsNullOrEmpty(userId))
            {
                return new UnauthorizedResult(); // Return 401 if token is invalid or missing
            }

            _logger.LogInformation("C# HTTP trigger function processed a request to get models. User: {UserId}, Engine: {EngineName}", userId, engineName ?? "All");

            if (string.IsNullOrEmpty(engineName))
            {
                var allModels = await _modelService.GetAllModelsAsync();
                return new OkObjectResult(allModels);
            }
            else
            {
                var engineModels = await _modelService.GetModelsByEngineAsync(engineName);
                return new OkObjectResult(engineModels);
            }
        }
    }
}
