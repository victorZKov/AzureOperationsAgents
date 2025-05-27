using AzureOperationsAgents.Core.Models.Chat;

namespace AzureOperationsAgents.Core.Interfaces.Chat
{
    public interface IChatService
    {
        Task<ChatHeader> CreateChatAsync(string userId, string? title = null);
        Task<List<ChatHeader>> GetChatsByUserAsync(string userId);
        Task<ChatDetail> AddMessageAsync(int chatHeaderId, string sender, string text, string? engineName, string? modelName);
        Task<List<ChatDetail>> GetMessagesByChatAsync(int chatHeaderId, string userId);
        Task<bool> DeleteChatAsync(int chatHeaderId, string userId);
        
        Task<bool> AssignChatToProjectAsync(int chatHeaderId, int? projectId, string userId);
        
        // New methods for like/dislike functionality
        Task<bool> LikeMessageAsync(int messageId, string userId);
        Task<bool> DislikeMessageAsync(int messageId, string userId);
        Task<List<ChatDetail>> GetRelevantMessages(string userId, CancellationToken cancellationToken);
    }
}

