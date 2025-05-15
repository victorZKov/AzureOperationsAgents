using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Scripting;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace AzureOperationsAgents.Agent0Scripting.Functions;

public class ScriptFunctions
{
    private readonly IScriptGenerationService _scriptGenerationService;
    private readonly IScriptRepository _scriptRepository;
    private readonly ILogger<ScriptFunctions> _logger;

    public ScriptFunctions(IScriptGenerationService scriptGenerationService, IScriptRepository scriptRepository, ILogger<ScriptFunctions> logger)
    {
        _scriptGenerationService = scriptGenerationService;
        _scriptRepository = scriptRepository;
        _logger = logger;
    }

    [Function("GenerateScript")]
    public async Task<HttpResponseData> GenerateScript(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "scripts")] HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("GenerateScript");
        var request = await req.ReadFromJsonAsync<GenerateScriptRequest>();
        if (request == null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        try
        {
            var script = await _scriptGenerationService.GenerateScriptAsync(request.Prompt, request.PreferredType);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(script);
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating script");
            var response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
            return response;
        }
    }

    [Function("GetScript")]
    public async Task<HttpResponseData> GetScript(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "scripts/{id:guid}")] HttpRequestData req,
        Guid id,
        FunctionContext executionContext)
    {
        var script = await _scriptRepository.GetByIdAsync(id);
        var response = req.CreateResponse(script != null ? HttpStatusCode.OK : HttpStatusCode.NotFound);
        if (script != null)
            await response.WriteAsJsonAsync(script);
        return response;
    }

    [Function("GetAllScripts")]
    public async Task<HttpResponseData> GetAllScripts(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "scripts")] HttpRequestData req)
    {
        var scripts = await _scriptRepository.GetAllAsync();
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(scripts);
        return response;
    }

    [Function("ValidateScript")]
    public async Task<HttpResponseData> ValidateScript(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "scripts/{id:guid}/validate")] HttpRequestData req,
        Guid id)
    {
        var script = await _scriptRepository.GetByIdAsync(id);
        if (script == null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        var isValid = await _scriptGenerationService.ValidateScriptAsync(script);
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(isValid);
        return response;
    }

    [Function("RefineScript")]
    public async Task<HttpResponseData> RefineScript(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "scripts/{id:guid}/refine")] HttpRequestData req,
        Guid id)
    {
        var script = await _scriptRepository.GetByIdAsync(id);
        if (script == null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        var refineRequest = await req.ReadFromJsonAsync<RefineScriptRequest>();
        if (refineRequest == null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var refinedScript = await _scriptGenerationService.RefineScriptAsync(script, refineRequest.Feedback);
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(refinedScript);
        return response;
    }
}