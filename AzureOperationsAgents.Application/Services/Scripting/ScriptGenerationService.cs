using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Scripting;
using Microsoft.Extensions.Logging;

namespace AzureOperationsAgents.Application.Services.Scripting;

public class ScriptGenerationService : IScriptGenerationService
{
    private readonly HttpClient _httpClient;
    private readonly IScriptRepository _scriptRepository;
    private readonly ILogger<ScriptGenerationService> _logger;

    private const string SYSTEM_PROMPT = @"You are an expert in Azure and Azure DevOps automation. 
Generate clean, production-ready scripts based on the following guidelines:
- Support both Azure CLI and Azure DevOps CLI
- Include helpful inline comments
- Include authentication steps unless explicitly told not to
- Make reasonable assumptions and document them in comments
- Ensure the output is valid and executable";

    public ScriptGenerationService(HttpClient httpClient, IScriptRepository scriptRepository, ILogger<ScriptGenerationService> logger)
    {
        _httpClient = httpClient;
        _scriptRepository = scriptRepository;
        _logger = logger;
    }

    public async Task<Script> GenerateScriptAsync(string prompt, ScriptType preferredType)
    {
        var combinedPrompt = $"{SYSTEM_PROMPT}\n\nGenerate a {preferredType} script for the following:\n{prompt}";

        var payload = new
        {
            model = "mistral:latest",
            prompt = combinedPrompt,
            stream = false
        };

        var response = await SendOllamaRequest(payload);
        var generated = response?.Response?.Trim() ?? "[empty]";

        var script = new Script
        {
            Name = prompt.Length > 50 ? prompt[..50] + "..." : prompt,
            Content = generated,
            Type = preferredType,
            CreatedAt = DateTime.UtcNow,
            IsSuccessful = true
        };

        return await _scriptRepository.AddAsync(script);
    }

    public async Task<bool> ValidateScriptAsync(Script script)
    {
        var validationPrompt = $@"{SYSTEM_PROMPT}
Validate the following {script.Type} script for correctness and best practices.
Respond only with 'VALID' or the validation issues found.

Script:
{script.Content}";

        var payload = new
        {
            model = "mistral:latest",
            prompt = validationPrompt,
            stream = false
        };

        var response = await SendOllamaRequest(payload);
        var text = response?.Response?.ToLower() ?? "";

        var isValid = text.Contains("valid") && !text.Contains("error") && !text.Contains("invalid");

        script.IsSuccessful = isValid;
        script.ErrorMessage = isValid ? null : text;
        await _scriptRepository.UpdateAsync(script);

        return isValid;
    }

    public async Task<Script> RefineScriptAsync(Script script, string feedback)
    {
        var prompt = $@"{SYSTEM_PROMPT}
Here is the original script:
{script.Content}

Refine the script based on the following feedback:
{feedback}";

        var payload = new
        {
            model = "mistral:latest",
            prompt = prompt,
            stream = false
        };

        var response = await SendOllamaRequest(payload);
        script.Content = response?.Response?.Trim() ?? script.Content;
        script.LastModifiedAt = DateTime.UtcNow;

        return await _scriptRepository.UpdateAsync(script);
    }

    private async Task<OllamaResponse?> SendOllamaRequest(object payload)
    {
        var requestJson = JsonSerializer.Serialize(payload);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/api/generate", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("Ollama error: {Error}", error);
            throw new Exception($"Ollama returned {response.StatusCode}");
        }

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<OllamaResponse>(json);
    }

    private class OllamaResponse
    {
        public string Response { get; set; } = "";
    }
}