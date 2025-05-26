using System;
using System.ComponentModel.DataAnnotations;

namespace AzureOperationsAgents.Core.Models.Configuration
{
    public class InstructionConfiguration
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Key { get; set; }
        
        [Required]
        public string Value { get; set; }
        
        public string Description { get; set; }
        
        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // IsActive flag to allow soft deletion or deactivation
        public bool IsActive { get; set; } = true;
    }
}
