namespace AzureOperationsAgents.Core.Models.Scripting;

public class GenerateScriptRequest
{
    public string Prompt { get; set; } = string.Empty;
    public ScriptType PreferredType { get; set; }
}
