using AzureOperationsAgents.Core.Interfaces.Backend;
using AzureOperationsAgents.Core.Models.Backend;

public static class Agent4Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent4-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Auditing Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}