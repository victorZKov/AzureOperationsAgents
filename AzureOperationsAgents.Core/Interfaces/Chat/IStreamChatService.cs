namespace AzureOperationsAgents.Core.Interfaces.Chat;

public interface IStreamChatService
{
    Task<Stream> StreamChatCompletionAsync(string prompt, string model, string language, string userId, CancellationToken cancellationToken);
}