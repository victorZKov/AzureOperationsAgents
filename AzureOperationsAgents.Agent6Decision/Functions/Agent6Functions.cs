using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Agent6Decision.Functions;

public class Agent6Functions
{
    [Function("GetStatus")]
    public async Task<HttpResponseData> GetStatus([HttpTrigger(AuthorizationLevel.Function, "get", Route = "status")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent6Metadata.Metadata);
        return response;
    }

    [Function("GetConfig")]
    public async Task<HttpResponseData> GetConfig([HttpTrigger(AuthorizationLevel.Function, "get", Route = "config")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent6Metadata.Config);
        return response;
    }

    [Function("UpdateConfig")]
    public async Task<HttpResponseData> UpdateConfig([HttpTrigger(AuthorizationLevel.Function, "post", Route = "config")] HttpRequestData req)
    {
        var newConfig = await req.ReadFromJsonAsync<AgentConfig>();
        Agent6Metadata.Config = newConfig;
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }

    [Function("RunAgent")]
    public async Task<HttpResponseData> RunAgent([HttpTrigger(AuthorizationLevel.Function, "post", Route = "run")] HttpRequestData req)
    {
        Agent6Metadata.Metadata.LastRunTime = DateTime.UtcNow;
        Agent6Metadata.Metadata.Status = "Running";

        // Simulate primary logic execution
        await Task.Delay(1000);

        Agent6Metadata.Metadata.Status = "Idle";
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }
}