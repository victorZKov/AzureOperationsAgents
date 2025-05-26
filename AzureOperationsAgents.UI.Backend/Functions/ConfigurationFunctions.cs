using System.Net;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Models.Configuration;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace AzureOperationsAgents.UI.Backend.Functions
{
    public class ConfigurationFunctions
    {
        private readonly IConfigurationService _configurationService;

        public ConfigurationFunctions(IConfigurationService configurationService)
        {
            _configurationService = configurationService;
        }

        [Function("GetUserConfigurations")]
        public async Task<HttpResponseData> GetUserConfigurations(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "configurations")]
            HttpRequestData req,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var configurations = await _configurationService.GetAllConfigurationsForUserAsync(userId);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(configurations);
            return response;
        }

        [Function("GetConfigurationById")]
        public async Task<HttpResponseData> GetConfigurationById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "configurations/{id:int}")]
            HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var configuration = await _configurationService.GetConfigurationByIdAsync(id);
            
            if (configuration == null || configuration.UserId != userId)
                return req.CreateResponse(HttpStatusCode.NotFound);

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(configuration);
            return response;
        }

        [Function("GetDefaultConfiguration")]
        public async Task<HttpResponseData> GetDefaultConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "configurations/default")]
            HttpRequestData req,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var configuration = await _configurationService.GetDefaultConfigurationForUserAsync(userId);
            
            if (configuration == null)
            {
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new { message = "No configuration found for user" });
                return response;
            }

            var successResponse = req.CreateResponse(HttpStatusCode.OK);
            await successResponse.WriteAsJsonAsync(configuration);
            return successResponse;
        }

        [Function("CreateConfiguration")]
        public async Task<HttpResponseData> CreateConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "configurations")]
            HttpRequestData req,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var requestBody = await JsonSerializer.DeserializeAsync<ConfigurationRequest>(req.Body);

            if (requestBody is null)
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var configuration = new UserConfiguration
            {
                UserId = userId,
                OpenAIKey = requestBody.OpenAIKey,
                OpenAIEndpoint = requestBody.OpenAIEndpoint,
                OpenAIModel = requestBody.OpenAIModel,
                OllamaServer = requestBody.OllamaServer,
                OllamaModel = requestBody.OllamaModel,
                SerperApiKey = requestBody.SerperApiKey,
                SerperApiEndpoint = requestBody.SerperApiEndpoint,
                IsDefault = requestBody.IsDefault
            };

            var createdConfiguration = await _configurationService.CreateConfigurationAsync(configuration);
            var response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(createdConfiguration);
            return response;
        }

        [Function("UpdateConfiguration")]
        public async Task<HttpResponseData> UpdateConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "configurations/{id:int}")]
            HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var existingConfig = await _configurationService.GetConfigurationByIdAsync(id);
            if (existingConfig == null || existingConfig.UserId != userId)
                return req.CreateResponse(HttpStatusCode.NotFound);

            var requestBody = await JsonSerializer.DeserializeAsync<ConfigurationRequest>(req.Body);
            if (requestBody is null)
                return req.CreateResponse(HttpStatusCode.BadRequest);

            existingConfig.OpenAIKey = requestBody.OpenAIKey;
            existingConfig.OpenAIEndpoint = requestBody.OpenAIEndpoint;
            existingConfig.OpenAIModel = requestBody.OpenAIModel;
            existingConfig.OllamaServer = requestBody.OllamaServer;
            existingConfig.OllamaModel = requestBody.OllamaModel;
            existingConfig.SerperApiKey = requestBody.SerperApiKey;
            existingConfig.SerperApiEndpoint = requestBody.SerperApiEndpoint;
            existingConfig.IsDefault = requestBody.IsDefault;

            var updatedConfiguration = await _configurationService.UpdateConfigurationAsync(existingConfig);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(updatedConfiguration);
            return response;
        }

        [Function("DeleteConfiguration")]
        public async Task<HttpResponseData> DeleteConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "configurations/{id:int}")]
            HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var existingConfig = await _configurationService.GetConfigurationByIdAsync(id);
            if (existingConfig == null || existingConfig.UserId != userId)
                return req.CreateResponse(HttpStatusCode.NotFound);

            var success = await _configurationService.DeleteConfigurationAsync(id);
            var response = req.CreateResponse(success ? HttpStatusCode.NoContent : HttpStatusCode.NotFound);
            return response;
        }

        [Function("SetDefaultConfiguration")]
        public async Task<HttpResponseData> SetDefaultConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "configurations/{id:int}/setDefault")]
            HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var success = await _configurationService.SetAsDefaultConfigurationAsync(id, userId);
            
            if (!success)
                return req.CreateResponse(HttpStatusCode.NotFound);
                
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { message = "Default configuration set successfully" });
            return response;
        }

        private class ConfigurationRequest
        {
            [JsonPropertyName("openAiKey")]
            public string OpenAIKey { get; set; } = string.Empty;

            [JsonPropertyName("openAiEndpoint")]
            public string OpenAIEndpoint { get; set; } = string.Empty;

            [JsonPropertyName("openAiModel")]
            public string OpenAIModel { get; set; } = string.Empty;

            [JsonPropertyName("ollamaServer")]
            public string OllamaServer { get; set; } = string.Empty;

            [JsonPropertyName("ollamaModel")]
            public string OllamaModel { get; set; } = string.Empty;

            [JsonPropertyName("serperApiKey")]
            public string SerperApiKey { get; set; } = string.Empty;

            [JsonPropertyName("serperApiEndpoint")]
            public string SerperApiEndpoint { get; set; } = string.Empty;

            [JsonPropertyName("isDefault")]
            public bool IsDefault { get; set; } = false;
        }
    }
}
