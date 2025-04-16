using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using AzureOperationsAgents.Core.Models.Backend;

namespace AzureOperationsAgents.Agent5Notifier.Functions;

public class Agent5Functions
{
    [Function("GetStatus")]
    public async Task<HttpResponseData> GetStatus([HttpTrigger(AuthorizationLevel.Function, "get", Route = "status")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent5Metadata.Metadata);
        return response;
    }

    [Function("GetConfig")]
    public async Task<HttpResponseData> GetConfig([HttpTrigger(AuthorizationLevel.Function, "get", Route = "config")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent5Metadata.Config);
        return response;
    }

    [Function("UpdateConfig")]
    public async Task<HttpResponseData> UpdateConfig([HttpTrigger(AuthorizationLevel.Function, "post", Route = "config")] HttpRequestData req)
    {
        var newConfig = await req.ReadFromJsonAsync<AgentConfig>();
        Agent5Metadata.Config = newConfig;
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }

    [Function("RunAgent")]
    public async Task<HttpResponseData> RunAgent([HttpTrigger(AuthorizationLevel.Function, "post", Route = "run")] HttpRequestData req)
    {
        Agent5Metadata.Metadata.LastRunTime = DateTime.UtcNow;
        Agent5Metadata.Metadata.Status = "Running";

        // Simulate primary logic execution
        await Task.Delay(1000);

        Agent5Metadata.Metadata.Status = "Idle";
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }
}