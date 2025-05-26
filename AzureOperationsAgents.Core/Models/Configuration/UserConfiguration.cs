using System;
using System.ComponentModel.DataAnnotations;

namespace AzureOperationsAgents.Core.Models.Configuration
{
    public class UserConfiguration
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string UserId { get; set; }
        
        // OpenAI Configuration
        [MaxLength(100)]
        public string OpenAIKey { get; set; }
        
        [MaxLength(200)]
        public string OpenAIEndpoint { get; set; }
        
        [MaxLength(50)]
        public string OpenAIModel { get; set; }
        
        // Ollama Configuration
        [MaxLength(200)]
        public string OllamaServer { get; set; }
        
        [MaxLength(50)]
        public string OllamaModel { get; set; }
        
        // Serper Configuration
        [MaxLength(100)]
        public string SerperApiKey { get; set; }
        
        [MaxLength(200)]
        public string SerperApiEndpoint { get; set; }
        
        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // IsActive flag to allow soft deletion or deactivation
        public bool IsActive { get; set; } = true;
        
        // IsDefault flag to indicate if these are the default settings for the user
        public bool IsDefault { get; set; } = false;
    }
}
