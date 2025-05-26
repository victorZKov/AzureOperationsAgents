namespace AzureOperationsAgents.Core.Interfaces.Chat;

public interface IStreamChatService
{
    Task<Stream> StreamChatCompletionAsync(string prompt, string userId, CancellationToken cancellationToken);
}