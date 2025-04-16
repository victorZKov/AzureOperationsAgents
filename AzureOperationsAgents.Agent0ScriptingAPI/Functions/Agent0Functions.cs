using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Agent0ScriptingAPI.Functions;

public class Agent0Functions
{
    [Function("GetStatus")]
    public async Task<HttpResponseData> GetStatus([HttpTrigger(AuthorizationLevel.Function, "get", Route = "status")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent0Metadata.Metadata);
        return response;
    }

    [Function("GetConfig")]
    public async Task<HttpResponseData> GetConfig([HttpTrigger(AuthorizationLevel.Function, "get", Route = "config")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent0Metadata.Config);
        return response;
    }

    [Function("UpdateConfig")]
    public async Task<HttpResponseData> UpdateConfig([HttpTrigger(AuthorizationLevel.Function, "post", Route = "config")] HttpRequestData req)
    {
        var newConfig = await req.ReadFromJsonAsync<AgentConfig>();
        Agent0Metadata.Config = newConfig;
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }

    [Function("RunAgent")]
    public async Task<HttpResponseData> RunAgent([HttpTrigger(AuthorizationLevel.Function, "post", Route = "run")] HttpRequestData req)
    {
        Agent0Metadata.Metadata.LastRunTime = DateTime.UtcNow;
        Agent0Metadata.Metadata.Status = "Running";

        // Simulate primary logic execution
        await Task.Delay(1000);

        Agent0Metadata.Metadata.Status = "Idle";
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }
}