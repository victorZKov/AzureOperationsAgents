using System;
using System.Threading.Tasks;
using Azure.AI.OpenAI;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Scripting;

namespace AzureOperationsAgents.Application.Services.Scripting;

public class ScriptGenerationService : IScriptGenerationService
{
    private readonly OpenAIClient _openAIClient;
    private readonly IScriptRepository _scriptRepository;
    private const string SYSTEM_PROMPT = @"You are an expert in Azure and Azure DevOps automation. 
Generate clean, production-ready scripts based on the following guidelines:
- Support both Azure CLI and Azure DevOps CLI
- Include helpful inline comments
- Include authentication steps unless explicitly told not to
- Make reasonable assumptions and document them in comments
- Ensure the output is valid and executable";

    public ScriptGenerationService(OpenAIClient openAIClient, IScriptRepository scriptRepository)
    {
        _openAIClient = openAIClient;
        _scriptRepository = scriptRepository;
    }

    public async Task<Script> GenerateScriptAsync(string prompt, ScriptType preferredType)
    {
        var options = new ChatCompletionsOptions
        {
            DeploymentName = "gpt-4",
            Messages =
            {
                new ChatRequestSystemMessage(SYSTEM_PROMPT),
                new ChatRequestUserMessage($"Generate a {preferredType} script for: {prompt}")
            },
            Temperature = 0.7f,
            MaxTokens = 2000
        };

        var chatCompletions = await _openAIClient.GetChatCompletionsAsync(options);
        var generatedContent = chatCompletions.Value.Choices[0].Message.Content;
        
        var script = new Script
        {
            Name = prompt.Length > 50 ? prompt[..50] + "..." : prompt,
            Content = generatedContent,
            Type = preferredType,
            CreatedAt = DateTime.UtcNow,
            IsSuccessful = true
        };

        return await _scriptRepository.AddAsync(script);
    }

    public async Task<bool> ValidateScriptAsync(Script script)
    {
        var options = new ChatCompletionsOptions
        {
            DeploymentName = "gpt-4",
            Messages =
            {
                new ChatRequestSystemMessage(SYSTEM_PROMPT + "\nYour task is to validate if the provided script is valid and follows best practices."),
                new ChatRequestUserMessage($"Validate this {script.Type} script:\n{script.Content}")
            },
            Temperature = 0.3f
        };

        var chatCompletions = await _openAIClient.GetChatCompletionsAsync(options);
        var validation = chatCompletions.Value.Choices[0].Message.Content;
        var isValid = !validation.ToLower().Contains("error") && !validation.ToLower().Contains("invalid");

        script.IsSuccessful = isValid;
        script.ErrorMessage = isValid ? null : validation;
        await _scriptRepository.UpdateAsync(script);

        return isValid;
    }

    public async Task<Script> RefineScriptAsync(Script script, string feedback)
    {
        var options = new ChatCompletionsOptions
        {
            DeploymentName = "gpt-4",
            Messages =
            {
                new ChatRequestSystemMessage(SYSTEM_PROMPT),
                new ChatRequestAssistantMessage(script.Content),
                new ChatRequestUserMessage($"Refine this script based on the following feedback: {feedback}")
            },
            Temperature = 0.7f,
            MaxTokens = 2000
        };

        var chatCompletions = await _openAIClient.GetChatCompletionsAsync(options);
        script.Content = chatCompletions.Value.Choices[0].Message.Content;
        script.LastModifiedAt = DateTime.UtcNow;
        
        return await _scriptRepository.UpdateAsync(script);
    }
} 