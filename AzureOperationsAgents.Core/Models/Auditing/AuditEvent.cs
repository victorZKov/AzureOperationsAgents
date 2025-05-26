using Azure;
using Azure.Data.Tables;

namespace AzureOperationsAgents.Core.Models.Auditing;

public class AuditEvent : ITableEntity
{
    public string PartitionKey { get; set; } = "Audit";
    public string RowKey { get; set; } = Guid.NewGuid().ToString();
    public string? AgentName { get; set; }
    public string? Message { get; set; }
    public DateTimeOffset? Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public ETag ETag { get; set; } = ETag.All;
}