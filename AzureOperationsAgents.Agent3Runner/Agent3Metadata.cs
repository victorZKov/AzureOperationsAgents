using AzureOperationsAgents.Core.Interfaces.Backend;
using AzureOperationsAgents.Core.Models.Backend;

public static class Agent3Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent3-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Runner Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}