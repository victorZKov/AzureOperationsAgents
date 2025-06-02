using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AzureOperationsAgents.Core.Models.Files;

public class Folder
{
    [Key]
    [JsonProperty("id")]
    public int Id { get; set; }
    [JsonProperty("owner")]
    public string Owner { get; set; }
    
    [JsonProperty("name")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [JsonProperty("color")]
    [MaxLength(10)]
    public string? Color { get; set; } = string.Empty;
    
    [JsonProperty("parent")]
    public int ParentId { get; set; }
    
    [JsonProperty("size")]
    public double Size { get; set; }
    [JsonProperty("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonProperty("modifiedAt")]
    public DateTime ModifiedAt { get; set; }
    
    [JsonProperty("type")]
    [MaxLength(10)]
    public string Type { get; set; } = "folder";
    
    [JsonProperty("isFavorited")]
    public bool IsFavorited { get; set; }
}
