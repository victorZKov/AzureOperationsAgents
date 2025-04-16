using System;
using System.Collections.Generic;
using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class AgentRepository
    {
        private readonly Dictionary<string, AgentInfo> _agents = new();
        private readonly Dictionary<string, AgentConfig> _configs = new();
        private readonly Dictionary<string, List<AgentLogEntry>> _logs = new();

        public Dictionary<string, AgentInfo> GetAgents() => _agents;

        public AgentInfo GetAgentById(string id) => _agents.ContainsKey(id) ? _agents[id] : null;

        public void UpdateAgentConfig(string id, AgentConfig config)
        {
            if (_configs.ContainsKey(id))
            {
                _configs[id] = config;
            }
            else
            {
                _configs.Add(id, config);
            }
        }

        public AgentConfig GetAgentConfig(string id) => _configs.ContainsKey(id) ? _configs[id] : null;

        public List<AgentLogEntry> GetAgentLogs(string id) => _logs.ContainsKey(id) ? _logs[id] : new List<AgentLogEntry>();

        public void AddAgentLog(string id, AgentLogEntry logEntry)
        {
            if (!_logs.ContainsKey(id))
            {
                _logs[id] = new List<AgentLogEntry>();
            }

            _logs[id].Add(logEntry);
        }
    }
}