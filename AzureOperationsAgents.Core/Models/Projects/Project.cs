namespace AzureOperationsAgents.Core.Models.Projects;

public class Project
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    // Entra ID user identifier (sub claim or oid)
    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}