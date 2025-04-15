using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Core.Interfaces.Classification;
using AzureOperationsAgents.Core.Interfaces.Execution;
using AzureOperationsAgents.Core.Interfaces.Monitoring;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Auditing;
using AzureOperationsAgents.Core.Models.Classification;
using AzureOperationsAgents.Core.Models.Execution;
using AzureOperationsAgents.Core.Models.Monitoring;
using AzureOperationsAgents.Core.Models.Scripting;
using AzureOperationsAgents.Core.Models.Notifier;

namespace AzureOperationsAgents.Application.Services.Orchestration;

public class OrchestrationService
{
    private readonly IMonitoringService _monitoringService;
    private readonly IEventClassificationService _classificationService;
    private readonly IScriptGenerationService _scriptGenerationService;
    private readonly IScriptExecutionService _executionService;
    private readonly IAuditEventRepository _auditRepository;

    public OrchestrationService(
        IMonitoringService monitoringService,
        IEventClassificationService classificationService,
        IScriptGenerationService scriptGenerationService,
        IScriptExecutionService executionService,
        IAuditEventRepository auditRepository)
    {
        _monitoringService = monitoringService;
        _classificationService = classificationService;
        _scriptGenerationService = scriptGenerationService;
        _executionService = executionService;
        _auditRepository = auditRepository;
    }

    public async Task HandleIncidentAsync(string incidentId, MonitoringResult monitoringResult)
    {
        // Log the start of the incident
        await LogAuditEventAsync("Incident started", incidentId);

        // Step 2: Request classification
        var classification = await _classificationService.ClassifyEventAsync(new EventClassification
        {
            EventId = incidentId,
            Source = "Monitoring",
            Timestamp = DateTime.UtcNow,
            EventData = new Dictionary<string, object> { { "Metrics", monitoringResult.Metrics } }
        });

        await LogAuditEventAsync("Event classified", incidentId, classification);

        // Step 3: Request script generation
        var script = await _scriptGenerationService.GenerateScriptAsync(
            "Generate a script for incident classification",
            ScriptType.PowerShell);

        await LogAuditEventAsync("Script generated", incidentId, script);

        // Step 4: Execute the script if allowed
        if (classification.Severity != "L1")
        {
            var execution = await _executionService.ExecuteScriptAsync(new ScriptExecution
            {
                ScriptId = script.Id.ToString(),
                Parameters = new Dictionary<string, string>()
            });

            await LogAuditEventAsync("Script executed", incidentId, execution);
        }

        // Step 5: Notify users
        var notification = new Notification
        {
            IncidentId = incidentId,
            Type = "IncidentUpdate",
            Audience = new List<string> { "admin@company.com" },
            Message = "Incident handled successfully",
            Details = new Dictionary<string, object> { { "Classification", classification }, { "Script", script } }
        };

        await _monitoringService.SendNotificationAsync(new OrchestratorNotification
        {
            ResourceId = monitoringResult.ResourceId,
            AlertName = "Incident Update",
            Description = notification.Message,
            Severity = classification.Severity,
            Status = "Resolved",
            MonitorCondition = "Resolved"
        });

        await LogAuditEventAsync("Incident resolved", incidentId);
    }

    private async Task LogAuditEventAsync(string message, string incidentId, object? details = null)
    {
        var auditEvent = new AuditEvent
        {
            AgentName = "Agent6Decision",
            Message = message,
            Timestamp = DateTimeOffset.UtcNow
        };

        if (details != null)
        {
            auditEvent.Message += $": {details}";
        }

        await _auditRepository.SaveAsync(auditEvent);
    }
}