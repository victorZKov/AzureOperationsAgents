using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AzureOperationsAgents.Core.Models.Files;

public class File
{
    [Key]
    [JsonProperty("id")]
    public Guid Id { get; set; }
    
    [JsonProperty("owner")]
    public string Owner { get; set; }
    
    [JsonProperty("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonProperty("folderId")]
    public int? FolderId { get; set; }
    
    [JsonProperty("parentId")]
    public int? ParentId { get; set; }
    [JsonProperty("isFavorited")]
    public bool IsFavorited { get; set; }
    
    [JsonProperty("tags")]
    public string? Tags { get; set; }
    
    [JsonProperty("url")]
    public string Url { get; set; } = string.Empty;
    
    [JsonProperty("size")]
    public double Size { get; set; }
    
    [JsonProperty("public")]
    public bool Public { get; set; }
    
    [JsonProperty("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonProperty("modifiedAt")]
    public DateTime ModifiedAt { get; set; }
    
    [JsonProperty("type")]
    [MaxLength(10)]
    public string Type { get; set; } = "file";
    
    [JsonProperty("description")]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    public FileDto GetFileDto()
    {
        var result = new FileDto
        {
            Id = Id,
            Owner = Owner,
            Name = Name,
            FolderId = FolderId,
            Url = Url,
            Size = Size,
            Type = Type,
            IsFavorited = IsFavorited,
            Tags = Tags,
            Description = Description,
        };
        
        return result;
    }
}