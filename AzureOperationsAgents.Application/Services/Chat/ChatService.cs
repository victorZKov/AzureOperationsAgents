using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Models.Chat;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AzureOperationsAgents.Application.Services.Chat
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _repository;

        public ChatService(IChatRepository repository)
        {
            _repository = repository;
        }

        public async Task<ChatHeader> CreateChatAsync(string userId, string? title = null)
        {
            var chat = new ChatHeader
            {
                UserId = userId,
                Title = title ?? $"Chat {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}",
                CreatedAt = DateTime.UtcNow
            };

            return await _repository.CreateChatAsync(chat);
        }

        public async Task<List<ChatHeader>> GetChatsByUserAsync(string userId)
        {
            return await _repository.GetChatsByUserAsync(userId);
        }

        public async Task<ChatDetail> AddMessageAsync(int chatHeaderId, string sender, string text, string? engineName, string? modelName)
        {
            var detail = new ChatDetail
            {
                ChatHeaderId = chatHeaderId,
                Sender = sender,
                Message = text,
                SentAt = DateTime.UtcNow,
                EngineName = engineName, // Added engine name
                ModelName = modelName    // Added model name
            };

            await _repository.AddMessageAsync(detail);
            return detail;
        }

        public async Task<List<ChatDetail>> GetMessagesByChatAsync(int chatHeaderId, string userId)
        {
            return await _repository.GetChatMessagesAsync(chatHeaderId, userId);
        }

        public async Task<bool> DeleteChatAsync(int chatHeaderId, string userId)
        {
            return await _repository.DeleteChatAsync(chatHeaderId, userId);
        }
        
        public async Task<bool> AssignChatToProjectAsync(int chatHeaderId, int? projectId, string userId)
        {
            if (projectId == null)
            {
                var chat = await _repository.GetChatByIdAsync(chatHeaderId);
                if (chat == null || chat.UserId != userId)
                    return false;
                chat.ProjectId = null;
                await _repository.UpdateChatAsync(chat);
                return true;
            }
            else
            {
                return await _repository.AssignChatToProjectAsync(chatHeaderId, projectId??0, userId);
            }
        }
    }
}

