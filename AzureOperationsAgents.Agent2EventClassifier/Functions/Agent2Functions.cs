using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using AzureOperationsAgents.Core.Models.Backend;

namespace AzureOperationsAgents.Agent2EventClassifier.Functions;

public class Agent2Functions
{
    [Function("GetStatus")]
    public async Task<HttpResponseData> GetStatus([HttpTrigger(AuthorizationLevel.Function, "get", Route = "status")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent2Metadata.Metadata);
        return response;
    }

    [Function("GetConfig")]
    public async Task<HttpResponseData> GetConfig([HttpTrigger(AuthorizationLevel.Function, "get", Route = "config")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(Agent2Metadata.Config);
        return response;
    }

    [Function("UpdateConfig")]
    public async Task<HttpResponseData> UpdateConfig([HttpTrigger(AuthorizationLevel.Function, "post", Route = "config")] HttpRequestData req)
    {
        var newConfig = await req.ReadFromJsonAsync<AgentConfig>();
        Agent2Metadata.Config = newConfig;
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }

    [Function("RunAgent")]
    public async Task<HttpResponseData> RunAgent([HttpTrigger(AuthorizationLevel.Function, "post", Route = "run")] HttpRequestData req)
    {
        Agent2Metadata.Metadata.LastRunTime = DateTime.UtcNow;
        Agent2Metadata.Metadata.Status = "Running";

        // Simulate primary logic execution
        await Task.Delay(1000);

        Agent2Metadata.Metadata.Status = "Idle";
        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }
}