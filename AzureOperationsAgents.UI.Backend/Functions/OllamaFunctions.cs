using agentfactory.agents.AzureOperationsAgents.Core.Models.Backend;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace agentfactory.agents.AzureOperationsAgents.UI.Backend.Functions;

public class OllamaFunctions
{
    private readonly ILogger<OllamaFunctions> _logger;

    public OllamaFunctions(ILogger<OllamaFunctions> logger)
    {
        _logger = logger;
    }

    [Function("GenerateFromOllama")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
        FunctionContext executionContext)
    {
        var identity = req.HttpContext?.User;

        var userId = identity?.FindFirst("oid")?.Value ?? "unknown";
        var userEmail = identity?.FindFirst("preferred_username")?.Value ?? "anonymous";

        _logger.LogInformation($"Request made by: {userEmail} (OID: {userId})");
        _logger.LogInformation("Ollama generate function triggered.");

        using var reader = new StreamReader(req.Body);
        var body = await reader.ReadToEndAsync();

        if (string.IsNullOrWhiteSpace(body))
        {
            return new BadRequestObjectResult("Missing request body.");
        }

        var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(body);

        if (data == null 
            || !data.TryGetValue("prompt", out var userPrompt) 
            || !data.TryGetValue("model", out var model) 
            || !data.TryGetValue("agent", out var agent))
        {
            return new BadRequestObjectResult("Missing 'prompt', 'model', or 'agent' in body. Optional: include 'preference' as 'powershell' or 'terraform'.");
        }

        var systemPrompt = AgentPrompts.GetPrompt(agent);

        if (data.TryGetValue("preference", out var preference))
        {
            _logger.LogInformation($"User prefers: {preference}");
        }
        else
        {
            _logger.LogInformation("No preference provided. Ask user if they prefer PowerShell or Terraform.");
        }

        var fullPrompt = $"{systemPrompt}\n\n{userPrompt}";

        using var httpClient = new HttpClient();
        var response = await httpClient.PostAsync("http://localhost:11434/api/generate", new StringContent(
            System.Text.Json.JsonSerializer.Serialize(new
            {
                model = model,
                prompt = fullPrompt,
                stream = false
            }), System.Text.Encoding.UTF8, "application/json"));

        if (!response.IsSuccessStatusCode)
        {
            return new StatusCodeResult((int)response.StatusCode);
        }

        var resultContent = await response.Content.ReadAsStringAsync();
        return new OkObjectResult(resultContent);
    }

}