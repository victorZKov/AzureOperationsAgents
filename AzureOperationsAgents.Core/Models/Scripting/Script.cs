using System;

namespace AzureOperationsAgents.Core.Models.Scripting;

public class Script
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public ScriptType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public bool IsSuccessful { get; set; }
    public string? ErrorMessage { get; set; }
}

public enum ScriptType
{
    PowerShell,
    Bash
}
