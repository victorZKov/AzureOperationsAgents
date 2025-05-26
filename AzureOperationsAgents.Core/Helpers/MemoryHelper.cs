using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Models.Chat;
using Microsoft.EntityFrameworkCore;

namespace AzureOperationsAgents.Core.Helpers;

public static class MemoryHelper
{
    public static async Task<string> GetUserMemoryAsync(AzureOperationsDbContext dbContext, string userId, int? currentChatId = null)
    {
        // Get last 5 messages from each of the latest 3 chats (excluding current chat)
        var previousMessages = await dbContext.ChatHeaders
            .Where(h => h.UserId == userId && (currentChatId == null || h.Id != currentChatId))
            .OrderByDescending(h => h.CreatedAt)
            .Take(3)
            .SelectMany(h => h.Messages.OrderBy(m => m.Id).Take(5))
            .ToListAsync();

        return string.Join("\n\n", previousMessages.Select(m => $"{m.Sender}: {m.Message}"));
    }

    public static async Task<string> GetChatMemoryAsync(AzureOperationsDbContext dbContext, int chatId)
    {
        var messages = await dbContext.ChatDetails
            .Where(m => m.ChatHeaderId == chatId)
            .OrderBy(m => m.Id)
            .ToListAsync();

        return string.Join("\n\n", messages.Select(m => $"{m.Sender}: {m.Message}"));
    }
}