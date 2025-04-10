using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Core.Interfaces;

public interface IScriptExecutionService
{
    Task<ScriptExecution> ExecuteScriptAsync(ScriptExecution execution);
    Task<ScriptExecution> GetExecutionAsync(string id);
    Task<List<ScriptExecution>> GetExecutionsByScriptIdAsync(string scriptId);
    Task<List<ScriptExecution>> GetExecutionsByStatusAsync(string status);
} 