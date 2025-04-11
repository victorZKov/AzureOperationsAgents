using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Core.Models.Auditing;

namespace AzureOperationsAgents.Application.Services.Auditing;

// AzureOperationsAgents.Application/Services/Auditing/AuditEventService.cs
public class AuditEventService
{
    private readonly IAuditEventRepository _repository;

    public AuditEventService(IAuditEventRepository repository)
    {
        _repository = repository;
    }

    public async Task SaveAsync(AuditEvent auditEvent)
    {
        await _repository.SaveAsync(auditEvent);
    }
}