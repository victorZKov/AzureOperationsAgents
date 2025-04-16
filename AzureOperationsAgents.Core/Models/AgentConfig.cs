using System.Collections.Generic;

namespace AzureOperationsAgents.Core.Models;

public class AgentConfig
{
    public Dictionary<string, object> Config { get; set; } = new();
}