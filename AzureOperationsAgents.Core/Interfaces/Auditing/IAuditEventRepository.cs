using AzureOperationsAgents.Core.Models.Auditing;

namespace AzureOperationsAgents.Core.Interfaces.Auditing;

public interface IAuditEventRepository
{
    Task SaveAsync(AuditEvent auditEvent);
}