using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Models.Chat;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Entities;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly AzureOperationsDbContext _context;

        public ChatRepository(AzureOperationsDbContext context)
        {
            _context = context;
        }

        public async Task<ChatHeader> CreateChatAsync(ChatHeader chat)
        {
            _context.ChatHeaders.Add(chat);
            await _context.SaveChangesAsync();
            return chat;
        }

        public async Task<List<ChatHeader>> GetChatsByUserAsync(string userId)
        {
            return await _context.ChatHeaders
                .Where(ch => ch.UserId == userId)
                .OrderByDescending(ch => ch.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<ChatDetail>> GetChatMessagesAsync(int chatId, string? userId)
        {
            return await _context.ChatDetails
                .Where(cd => cd.ChatHeaderId == chatId &&
                             (string.IsNullOrEmpty(userId) || cd.ChatHeader.UserId == userId))
                .OrderBy(cd => cd.SentAt)
                .ToListAsync();
        }

        public async Task AddMessageAsync(ChatDetail message)
        {
            _context.ChatDetails.Add(message);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteChatAsync(int chatId, string userId)
        {
            var chat = await _context.ChatHeaders
                .Include(ch => ch.Messages)
                .FirstOrDefaultAsync(ch => ch.Id == chatId && ch.UserId == userId);

            if (chat == null) return false;

            _context.ChatDetails.RemoveRange(chat.Messages);
            _context.ChatHeaders.Remove(chat);
            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<bool> AssignChatToProjectAsync(int chatHeaderId, int projectId, string userId)
        {
            var chat = await _context.ChatHeaders
                .FirstOrDefaultAsync(ch => ch.Id == chatHeaderId && ch.UserId == userId);

            if (chat == null)
                return false;

            chat.ProjectId = projectId;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ChatHeader?> GetChatByIdAsync(int chatHeaderId)
        {
            var chat = await _context.ChatHeaders
                .FirstOrDefaultAsync(ch => ch.Id == chatHeaderId);
            return chat;
        }

        public async Task UpdateChatAsync(ChatHeader chat)
        {
            _context.ChatHeaders.Update(chat);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> LikeMessageAsync(int messageId)
        {
            var message = await _context.ChatDetails
                .FirstOrDefaultAsync(m => m.Id == messageId);
            if (message == null)
            {
                return false; // Message not found
            }
            message.ThumbsUp = true; // Set thumbs up
            _context.ChatDetails.Update(message);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DislikeMessageAsync(int messageId)
        {
            var message = await _context.ChatDetails
                .FirstOrDefaultAsync(m => m.Id == messageId);
            if (message == null)
            {
                return false; // Message not found
            }
            message.ThumbsDown = true; // Set thumbs down
            _context.ChatDetails.Update(message);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ChatDetail?> GetMessageByIdAsync(int messageId)
        {
            var message = await _context.ChatDetails
                .FirstOrDefaultAsync(m => m.Id == messageId);
            return message;
        }

        public async Task<List<ChatDetail>> GetRelevantMessagesAsync(string userId, CancellationToken cancellationToken)
        {
            return await _context.ChatDetails
                .Where(m => m.ChatHeader.UserId == userId && (m.ThumbsUp == true))
                .OrderByDescending(m => m.SentAt)
                .Take(20)
                .ToListAsync(cancellationToken);
        }
    }
}
