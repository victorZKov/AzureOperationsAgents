using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Models.Chat;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class ChatFunctions
{
    private readonly ILogger<ChatFunctions> _logger;
    private readonly IChatService _chatService;

    public ChatFunctions(ILogger<ChatFunctions> logger, IChatService chatService)
    {
        _logger = logger;
        _chatService = chatService;
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

    private class AssignChatRequest
    {
        [JsonPropertyName("projectId")]
        public int ProjectId { get; set; }
    }

    private class CreateChatRequest
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
    }

    private class AddMessageRequest
    {
        [JsonPropertyName("sender")]
        public string Sender { get; set; } = string.Empty;

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("engineName")]
        public string? EngineName { get; set; }

        [JsonPropertyName("modelName")]
        public string? ModelName { get; set; }
    }
}
