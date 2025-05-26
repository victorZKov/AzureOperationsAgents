using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using AzureOperationsAgents.Application.Services.Chat;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Models.Chat;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class ChatFunctions
{
    private readonly ILogger<ChatFunctions> _logger;
    private readonly IChatService _chatService;
    private readonly OpenAiService _openaiService;
    private readonly OllamaService _ollamaService;
    private readonly string _defaultOpenAiModel;
    

    public ChatFunctions(ILogger<ChatFunctions> logger, IChatService chatService,
        OpenAiService openaiService,
        OllamaService ollamaService,
        IConfiguration configuration)
    {
        _logger = logger;
        _chatService = chatService;
        _openaiService = openaiService;
        _ollamaService = ollamaService;
        _defaultOpenAiModel = configuration["OpenAIModel"] ?? "gpt-3.5-turbo";
    }

    [Function("GetChats")]
    public async Task<HttpResponseData> GetChats(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "chats")] HttpRequestData req)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var chats = await _chatService.GetChatsByUserAsync(userId);
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(chats);
        return response;
    }

    [Function("CreateChat")]
    public async Task<HttpResponseData> CreateChat(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chats")] HttpRequestData req)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var body = await JsonSerializer.DeserializeAsync<CreateChatRequest>(req.Body);
        var chat = await _chatService.CreateChatAsync(userId, body?.Title);
        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(chat);
        return response;
    }

    [Function("GetChatMessages")]
    public async Task<HttpResponseData> GetChatMessages(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "chats/{id:int}/messages")] HttpRequestData req,
        int id)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var messages = await _chatService.GetMessagesByChatAsync(id, userId);
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(messages);
        return response;
    }

    [Function("AddChatMessage")]
    public async Task<HttpResponseData> AddChatMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chats/{id:int}/messages")] HttpRequestData req,
        int id)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var body = await JsonSerializer.DeserializeAsync<AddMessageRequest>(req.Body);
        if (body == null || string.IsNullOrWhiteSpace(body.Sender) || string.IsNullOrWhiteSpace(body.Message))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var detail = await _chatService.AddMessageAsync(id, body.Sender, body.Message, body.EngineName, body.ModelName);
        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(detail);
        return response;
    }

    [Function("DeleteChat")]
    public async Task<HttpResponseData> DeleteChat(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "chats/{id:int}")] HttpRequestData req,
        int id)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var success = await _chatService.DeleteChatAsync(id, userId);
        var response = req.CreateResponse(success ? HttpStatusCode.NoContent : HttpStatusCode.NotFound);
        return response;
    }
    
    [Function("AssignChatToProject")]
    public async Task<HttpResponseData> AssignChatToProject(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chats/{chatId:int}/assign")] HttpRequestData req,
        int chatId)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var body = await JsonSerializer.DeserializeAsync<AssignChatRequest>(req.Body);
        if (body == null || body.ProjectId <= 0)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var success = await _chatService.AssignChatToProjectAsync(chatId, body.ProjectId, userId);
        var response = req.CreateResponse(success ? HttpStatusCode.OK : HttpStatusCode.NotFound);
        return response;
    }
    
    [Function("DeAssignChatToProject")]
    public async Task<HttpResponseData> DeAssignChatToProject(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "chats/{chatId:int}/deassign")] HttpRequestData req,
        int chatId)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);

        var success = await _chatService.AssignChatToProjectAsync(chatId, null, userId);
        var response = req.CreateResponse(success ? HttpStatusCode.OK : HttpStatusCode.NotFound);
        return response;
    }

    [Function("ChatConversation")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chat/conversation")]
        HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("ChatConversation");
        logger.LogInformation("ChatConversation function triggered.");

        var body = await new StreamReader(req.Body).ReadToEndAsync();
        var conversationRequest = JsonSerializer.Deserialize<ConversationRequest>(body);

        if (conversationRequest == null || string.IsNullOrEmpty(conversationRequest.Prompt))
        {
            logger.LogError("Missing or invalid prompt.");
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Missing or invalid prompt.");
            return badResponse;
        }

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("User ID not found in token.");
            var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
            await unauthorizedResponse.WriteStringAsync("User ID not found in token.");
            return unauthorizedResponse;
        }

        HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/event-stream");

        Stream? stream = null;

        if (conversationRequest.EngineName.Equals("openai", StringComparison.OrdinalIgnoreCase))
        {
            string model = string.IsNullOrEmpty(conversationRequest.ModelName)
                ? _defaultOpenAiModel
                : conversationRequest.ModelName;

            stream = await _openaiService.StreamChatCompletionAsync(conversationRequest.Prompt, model, conversationRequest.Language, userId, CancellationToken.None);

            await using var writer = new StreamWriter(response.Body);
            using var readerStream = new StreamReader(stream);

            while (!readerStream.EndOfStream)
            {
                var line = await readerStream.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                if (line.StartsWith("data: "))
                {
                    var jsonPart = line.Substring("data: ".Length).Trim();

                    if (jsonPart == "[DONE]")
                        continue;

                    try
                    {
                        using var jsonDoc = JsonDocument.Parse(jsonPart);
                        var choice = jsonDoc.RootElement.GetProperty("choices")[0];

                        string responseContent = "";
                        if (choice.TryGetProperty("delta", out var delta) && delta.TryGetProperty("content", out var contentProp) && contentProp.ValueKind == JsonValueKind.String)
                        {
                            responseContent = contentProp.GetString() ?? "";
                        }

                        bool isDone = choice.TryGetProperty("finish_reason", out var finishReasonProp) && finishReasonProp.ValueKind != JsonValueKind.Null;

                        var streamEvent = new
                        {
                            model = model,
                            created_at = DateTime.UtcNow.ToString("o"),
                            response = responseContent,
                            done = isDone
                        };

                        string newJsonPayload = JsonSerializer.Serialize(streamEvent);
                        await writer.WriteAsync(newJsonPayload + "\n");
                        await writer.FlushAsync();
                    }
                    catch (JsonException ex)
                    {
                        logger.LogWarning($"Skipping invalid JSON chunk: {jsonPart}. Error: {ex.Message}");
                    }
                }
            }
        }
        else if (conversationRequest.EngineName.Equals("ollama", StringComparison.OrdinalIgnoreCase))
        {
            stream = await _ollamaService.StreamChatCompletionAsync(conversationRequest.Prompt, conversationRequest.ModelName, conversationRequest.Language, userId, CancellationToken.None);

            await using var writer = new StreamWriter(response.Body);
            using var readerStream = new StreamReader(stream);

            while (!readerStream.EndOfStream)
            {
                var line = await readerStream.ReadLineAsync();
                if (!string.IsNullOrWhiteSpace(line))
                {
                    await writer.WriteLineAsync(line);
                    await writer.FlushAsync();
                }
            }
        }
        else
        {
            logger.LogError($"Unsupported engine: {conversationRequest.EngineName}");
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync($"Unsupported engine: {conversationRequest.EngineName}");
            return badResponse;
        }

        return response;
    }
}



