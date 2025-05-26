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
    }
}