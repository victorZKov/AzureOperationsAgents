using Azure;
using Azure.AI.OpenAI;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Scripting;
using Moq;
using Xunit;

namespace AzureOperationsAgents.Tests.Services;

public class ScriptGenerationServiceTests
{
    private readonly Mock<OpenAIClient> _openAIClientMock;
    private readonly Mock<IScriptRepository> _scriptRepositoryMock;
    private readonly ScriptGenerationService _service;

    public ScriptGenerationServiceTests()
    {
        _openAIClientMock = new Mock<OpenAIClient>();
        _scriptRepositoryMock = new Mock<IScriptRepository>();
        _service = new ScriptGenerationService(_openAIClientMock.Object, _scriptRepositoryMock.Object);
    }

    [Fact]
    public async Task GenerateScript_WithValidRequest_ReturnsScript()
    {
        // Arrange
        var prompt = "Create a resource group";
        var scriptType = ScriptType.PowerShell;
        var generatedScript = "# Generated PowerShell script\nNew-AzResourceGroup -Name 'MyResourceGroup' -Location 'westus2'";

        var mockResponse = new Response<ChatCompletions>();
        var mockCompletions = new ChatCompletions(
            id: "test-id",
            created: DateTimeOffset.UtcNow,
            choices: new[] 
            { 
                new ChatChoice(
                    index: 0,
                    message: new ChatMessage(ChatRole.Assistant, generatedScript),
                    finishReason: CompletionsFinishReason.Stop
                )
            },
            usage: new CompletionsUsage(promptTokens: 10, completionTokens: 20, totalTokens: 30)
        );

        _openAIClientMock
            .Setup(x => x.GetChatCompletionsAsync(
                It.IsAny<ChatCompletionsOptions>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Response.FromValue(mockCompletions, mockResponse));

        _scriptRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Script>()))
            .ReturnsAsync((Script s) => s);

        // Act
        var result = await _service.GenerateScriptAsync(prompt, scriptType);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(generatedScript, result.Content);
        Assert.Equal(scriptType, result.Type);
        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public async Task GenerateScript_WithError_ThrowsException()
    {
        // Arrange
        var prompt = "Create a resource group";
        var scriptType = ScriptType.PowerShell;

        _openAIClientMock
            .Setup(x => x.GetChatCompletionsAsync(
                It.IsAny<ChatCompletionsOptions>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new RequestFailedException("Error calling OpenAI API"));

        // Act & Assert
        await Assert.ThrowsAsync<RequestFailedException>(() => 
            _service.GenerateScriptAsync(prompt, scriptType));
    }
} 