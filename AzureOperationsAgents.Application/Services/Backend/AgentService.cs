using AzureOperationsAgents.Core.Models.Backend;
using AzureOperationsAgents.Infrastructure.Repositories;

namespace AzureOperationsAgents.Application.Services.Backend
{
    public class AgentService
    {
        private readonly AgentRepository _repository;

        public AgentService(AgentRepository repository)
        {
            _repository = repository;
        }

        public Dictionary<string, AgentInfo> GetAllAgents() => _repository.GetAgents();

        public AgentInfo GetAgentById(string id) => _repository.GetAgentById(id);

        public void UpdateAgentConfig(string id, AgentConfig config) => _repository.UpdateAgentConfig(id, config);

        public List<AgentLogEntry> GetAgentLogs(string id) => _repository.GetAgentLogs(id);

        public void AddAgentLog(string id, AgentLogEntry logEntry) => _repository.AddAgentLog(id, logEntry);

        public void TriggerAgentRun(string id)
        {
            var agent = _repository.GetAgentById(id);
            if (agent != null)
            {
                agent.LastRunTime = DateTime.UtcNow;
                agent.Status = "Running";
            }
        }
    }
}