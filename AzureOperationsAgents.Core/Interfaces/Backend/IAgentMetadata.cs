namespace AzureOperationsAgents.Core.Interfaces.Backend;

public interface IAgentMetadata
{
    string Id { get; set; }
    string Name { get; set; }
    string Version { get; set; }
    string Status { get; set; }
    DateTime LastRunTime { get; set; }
}