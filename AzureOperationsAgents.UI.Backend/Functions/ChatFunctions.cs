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

    // ChatConversation Function
    [Function("ChatConversation")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chat/conversation")] HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("ChatConversation");
        logger.LogInformation("ChatConversation function triggered.");

        var body = await new StreamReader(req.Body).ReadToEndAsync();
        var conversationRequest = JsonSerializer.Deserialize<ConversationRequest>(body);

        if (conversationRequest == null || string.IsNullOrEmpty(conversationRequest.Prompt))
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Missing or invalid prompt.");
            return badResponse;
        }

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
            await unauthorizedResponse.WriteStringAsync("User ID not found in token.");
            return unauthorizedResponse;
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/event-stream");

        await using var writer = new StreamWriter(response.Body);

        if (conversationRequest.EngineName.Equals("openai", StringComparison.OrdinalIgnoreCase))
        {
            await _openaiService.StreamChatCompletionAsync(
                conversationRequest.ChatHeaderId ?? 0,
                conversationRequest.Prompt,
                conversationRequest.ModelName,
                conversationRequest.Language,
                userId,
                CancellationToken.None,
                async content =>
                {
                    var payload = JsonSerializer.Serialize(new
                    {
                        model = conversationRequest.ModelName,
                        created_at = DateTime.UtcNow.ToString("o"),
                        response = content
                    });
                    Console.WriteLine($"Sent line to client: {payload}");
                    await writer.WriteLineAsync(payload);
                    await writer.FlushAsync();
                });
        }
        else if (conversationRequest.EngineName.Equals("ollama", StringComparison.OrdinalIgnoreCase))
        {
            await _ollamaService.StreamChatCompletionAsync(
                conversationRequest.ChatHeaderId ?? 0,
                conversationRequest.Prompt,
                conversationRequest.ModelName,
                conversationRequest.Language,
                userId,
                CancellationToken.None,
                async content =>
                {
                    var payload = JsonSerializer.Serialize(new
                    {
                        model = conversationRequest.ModelName,
                        created_at = DateTime.UtcNow.ToString("o"),
                        response = content
                    });
                    await writer.WriteLineAsync(payload);
                    await writer.FlushAsync();

                    
                });
        }
        else
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync($"Unsupported engine: {conversationRequest.EngineName}");
            return badResponse;
        }

        return response;
    }


    [Function("LikeMessage")]
    public async Task<HttpResponseData> LikeMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chats/messages/{messageId:int}/like")]
        HttpRequestData req,
        int messageId)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);
        
        var success = await _chatService.LikeMessageAsync(messageId, userId);
        var response = req.CreateResponse(success ? HttpStatusCode.OK : HttpStatusCode.NotFound);
        return response;

    }

    [Function("DislikeMessage")]
    public async Task<HttpResponseData> DislikeMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chats/messages/{messageId:int}/dislike")]
        HttpRequestData req,
        int messageId)
    {
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
            return req.CreateResponse(HttpStatusCode.Unauthorized);
        var success = await _chatService.DislikeMessageAsync(messageId, userId);
        var response = req.CreateResponse(success ? HttpStatusCode.OK : HttpStatusCode.NotFound);
        return response;
    }
}





