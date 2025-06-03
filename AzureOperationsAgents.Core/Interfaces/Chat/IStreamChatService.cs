namespace AzureOperationsAgents.Core.Interfaces.Chat;

public interface IStreamChatService
{
    Task StreamChatCompletionAsync(int chatId, string prompt, string model, string language, string userId, CancellationToken cancellationToken, Func<string, Task> onResponse);
}