using AzureOperationsAgents.Application.Services.Backend;
using AzureOperationsAgents.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Backend;
using AzureOperationsAgents.Core.Models.Backend;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class AgentFunctions
{
    private readonly IAgentMetadata _agentMetadata;
    private readonly AgentConfig _agentConfig;

    public AgentFunctions(IAgentMetadata agentMetadata, AgentConfig agentConfig)
    {
        _agentMetadata = agentMetadata;
        _agentConfig = agentConfig;
    }

    [Function("GetAgentStatus")]
    public HttpResponseData GetAgentStatus([HttpTrigger(AuthorizationLevel.Function, "get", Route = "status")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.WriteAsJsonAsync(_agentMetadata);
        return response;
    }

    [Function("GetAgentConfig")]
    public HttpResponseData GetAgentConfig([HttpTrigger(AuthorizationLevel.Function, "get", Route = "config")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.WriteAsJsonAsync(_agentConfig);
        return response;
    }

    [Function("UpdateAgentConfig")]
    public HttpResponseData UpdateAgentConfig([HttpTrigger(AuthorizationLevel.Function, "post", Route = "config")] HttpRequestData req)
    {
        var requestBody = new StreamReader(req.Body).ReadToEnd();
        var newConfig = JsonSerializer.Deserialize<Dictionary<string, object>>(requestBody);
        if (newConfig != null)
        {
            _agentConfig.Config = newConfig;
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.WriteString("Configuration updated successfully.");
        return response;
    }

    [Function("RunAgent")]
    public HttpResponseData RunAgent([HttpTrigger(AuthorizationLevel.Function, "post", Route = "run")] HttpRequestData req)
    {
        _agentMetadata.Status = "Running";
        _agentMetadata.LastRunTime = DateTime.UtcNow;

        // Simulate agent logic execution
        _agentMetadata.Status = "Idle";

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.WriteString("Agent executed successfully.");
        return response;
    }
}