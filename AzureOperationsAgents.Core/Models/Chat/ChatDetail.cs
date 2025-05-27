namespace AzureOperationsAgents.Core.Models.Chat;

public class ChatDetail
{
    public int Id { get; set; }

    public int ChatHeaderId { get; set; }
    public ChatHeader ChatHeader { get; set; } = null!;

    public string Sender { get; set; } = string.Empty; // "user" o "assistant"
    public string Message { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public string? EngineName { get; set; }
    public string? ModelName { get; set; }
    public bool? ThumbsUp { get; set; }
    public bool? ThumbsDown { get; set; }
}
