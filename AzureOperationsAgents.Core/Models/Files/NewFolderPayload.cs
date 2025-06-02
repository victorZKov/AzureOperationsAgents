using Newtonsoft.Json;

namespace AzureOperationsAgents.Core.Models.Files;

public class NewFolderPayload
{
    [JsonProperty("name")]
    public string? Name { get; set; }
    [JsonProperty("parentFolderId")]
    public int ParentFolderId { get; set; }
}