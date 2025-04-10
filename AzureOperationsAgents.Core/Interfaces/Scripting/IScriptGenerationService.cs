using System.Threading.Tasks;
using AzureOperationsAgents.Core.Models.Scripting;

namespace AzureOperationsAgents.Core.Interfaces.Scripting;

public interface IScriptGenerationService
{
    Task<Script> GenerateScriptAsync(string prompt, ScriptType preferredType);
    Task<bool> ValidateScriptAsync(Script script);
    Task<Script> RefineScriptAsync(Script script, string feedback);
} 