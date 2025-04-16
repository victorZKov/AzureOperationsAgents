namespace AzureOperationsAgents.Core.Interfaces.Backend;

public class AgentMetadata : IAgentMetadata
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Version { get; set; }
    public string Status { get; set; }
    public DateTime LastRunTime { get; set; }
}