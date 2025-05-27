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
        
        // New methods for like/dislike functionality
        public async Task<bool> LikeMessageAsync(int messageId, string userId)
        {
            // Get the message to verify it exists
            var message = await _repository.GetMessageByIdAsync(messageId);
            if (message == null)
            {
                return false;
            }
            
            // Validate that the user can access this message
            var chatMessages = await _repository.GetChatMessagesAsync(message.ChatHeaderId, userId);
            if (chatMessages.All(m => m.Id != messageId))
            {
                return false; // User doesn't have access to this message
            }
            
            // Set the thumbs up value
            return await _repository.LikeMessageAsync(messageId);
        }
        
        public async Task<bool> DislikeMessageAsync(int messageId, string userId)
        {
            // Get the message to verify it exists
            var message = await _repository.GetMessageByIdAsync(messageId);
            if (message == null)
            {
                return false;
            }
            
            // Validate that the user can access this message
            var chatMessages = await _repository.GetChatMessagesAsync(message.ChatHeaderId, userId);
            if (chatMessages.All(m => m.Id != messageId))
            {
                return false; // User doesn't have access to this message
            }
            
            // Set the thumbs down value
            return await _repository.DislikeMessageAsync(messageId);
        }

        public async Task<List<ChatDetail>> GetRelevantMessages(string userId, CancellationToken cancellationToken)
        {
            var messages = await _repository.GetRelevantMessagesAsync(userId, cancellationToken);
            if (messages == null)
            {
                return new List<ChatDetail>();
            }

            return messages;

        }
    }
}

