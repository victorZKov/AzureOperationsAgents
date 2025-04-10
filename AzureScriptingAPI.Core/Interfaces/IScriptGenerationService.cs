using System.Threading.Tasks;
using AzureScriptingAPI.Core.Models;

namespace AzureScriptingAPI.Core.Interfaces;

public interface IScriptGenerationService
{
    Task<Script> GenerateScriptAsync(string prompt, ScriptType preferredType);
    Task<bool> ValidateScriptAsync(Script script);
    Task<Script> RefineScriptAsync(Script script, string feedback);
} 