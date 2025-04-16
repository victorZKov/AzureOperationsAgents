using System.Text.Json;
using AzureOperationsAgents.Agent4Auditing.SignalR;
using AzureOperationsAgents.Application.Services.Auditing;
using AzureOperationsAgents.Core.Models.Auditing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.Functions.Worker;

namespace AzureOperationsAgent.Agent4Auditing.Functions;

public class AuditEventLogger
{
    private readonly AuditEventService _auditService;
    private readonly IHubContext<AuditHub> _hub;

    public AuditEventLogger(AuditEventService auditService, IHubContext<AuditHub> hub)
    {
        _auditService = auditService;
        _hub = hub;
    }

    [Function("AuditEventLogger")]
    public async Task RunAsync(
        [ServiceBusTrigger("event-log", "audit-sub", Connection = "ServiceBusConnection")] string message,
        FunctionContext context)
    {
        var auditEvent = JsonSerializer.Deserialize<AuditEvent>(message);
        await _auditService.SaveAsync(auditEvent);
        await _hub.Clients.All.SendAsync("NewAuditEvent", auditEvent);
    }
}