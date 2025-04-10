using AzureOperationsAgents.Core.Models.Execution;

namespace AzureOperationsAgents.Core.Interfaces.Execution;

public interface IScriptExecutionService
{
    Task<ScriptExecution> ExecuteScriptAsync(ScriptExecution execution);
    Task<ScriptExecution> GetExecutionAsync(string id);
    Task<List<ScriptExecution>> GetExecutionsByScriptIdAsync(string scriptId);
    Task<List<ScriptExecution>> GetExecutionsByStatusAsync(string status);
} 