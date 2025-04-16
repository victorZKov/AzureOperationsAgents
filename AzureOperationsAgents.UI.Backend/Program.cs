using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Infrastructure.Repositories;
using AzureOperationsAgents.Core.Models;
using System.Text.Json;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddSingleton<AgentRepository>();
        services.AddSingleton<AgentService>();
    })
    .Build();

host.Run();

public static class AgentFunctions
{
    [Function("GetAgents")]
    public static HttpResponseData GetAgents(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "api/agents")] HttpRequestData req,
        FunctionContext executionContext,
        AgentService agentService)
    {
        var agents = agentService.GetAllAgents();
        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        response.WriteString(JsonSerializer.Serialize(agents));
        return response;
    }

    [Function("GetAgentById")]
    public static HttpResponseData GetAgentById(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "api/agents/{id}")] HttpRequestData req,
        string id,
        FunctionContext executionContext,
        AgentService agentService)
    {
        var agent = agentService.GetAgentById(id);
        if (agent == null)
        {
            var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
            notFoundResponse.WriteString("Agent not found");
            return notFoundResponse;
        }

        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        response.WriteString(JsonSerializer.Serialize(agent));
        return response;
    }

    [Function("UpdateAgentConfig")]
    public static HttpResponseData UpdateAgentConfig(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "api/agents/{id}/config")] HttpRequestData req,
        string id,
        FunctionContext executionContext,
        AgentService agentService)
    {
        var requestBody = req.ReadAsString();
        var config = JsonSerializer.Deserialize<AgentConfig>(requestBody);
        agentService.UpdateAgentConfig(id, config);

        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        response.WriteString("Config updated successfully");
        return response;
    }

    [Function("RunAgent")]
    public static HttpResponseData RunAgent(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "api/agents/{id}/run")] HttpRequestData req,
        string id,
        FunctionContext executionContext,
        AgentService agentService)
    {
        agentService.TriggerAgentRun(id);

        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        response.WriteString("Agent run triggered successfully");
        return response;
    }

    [Function("GetAgentLogs")]
    public static HttpResponseData GetAgentLogs(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "api/agents/{id}/logs")] HttpRequestData req,
        string id,
        FunctionContext executionContext,
        AgentService agentService)
    {
        var logs = agentService.GetAgentLogs(id);
        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        response.WriteString(JsonSerializer.Serialize(logs));
        return response;
    }
}