using AzureOperationsAgents.Core.Models.Chat;

namespace AzureOperationsAgents.Core.Interfaces.Chat
{
    public interface IChatRepository
    {
        Task<ChatHeader> CreateChatAsync(ChatHeader chat);
        Task<List<ChatHeader>> GetChatsByUserAsync(string userId);
        Task<List<ChatDetail>> GetChatMessagesAsync(int chatId, string? userId);
        Task AddMessageAsync(ChatDetail message);
        Task<bool> DeleteChatAsync(int chatId, string userId);
        Task<bool> AssignChatToProjectAsync(int chatHeaderId, int projectId, string userId);
        Task<ChatHeader?> GetChatByIdAsync(int chatHeaderId);
        Task UpdateChatAsync(ChatHeader chat);
        
        // New methods for like/dislike functionality
        Task<bool> LikeMessageAsync(int messageId);
        Task<bool> DislikeMessageAsync(int messageId);
        Task<ChatDetail?> GetMessageByIdAsync(int messageId);
        Task<List<ChatDetail>> GetRelevantMessagesAsync(string userId, CancellationToken cancellationToken);
    }
}

