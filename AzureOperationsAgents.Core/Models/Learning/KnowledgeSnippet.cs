using System.ComponentModel.DataAnnotations;

namespace AzureOperationsAgents.Core.Models.Learning;

public class KnowledgeSnippet
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string ChatTitle { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string EmbeddingJson { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}