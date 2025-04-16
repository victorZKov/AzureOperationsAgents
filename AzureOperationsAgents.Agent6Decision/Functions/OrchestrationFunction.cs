using System.Text.Json;
using AzureOperationsAgents.Application.Services.Orchestration;
using AzureOperationsAgents.Core.Models.Monitoring;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace AzureOperationsAgents.Agent6Decision.Functions;

public class OrchestrationFunction
{
    private readonly OrchestrationService _orchestrationService;
    private readonly ILogger<OrchestrationFunction> _logger;

    public OrchestrationFunction(OrchestrationService orchestrationService, ILogger<OrchestrationFunction> logger)
    {
        _orchestrationService = orchestrationService;
        _logger = logger;
    }

    [Function("HandleIncident")]
    public async Task RunAsync(
        [ServiceBusTrigger("incidents", Connection = "ServiceBusConnection")] string message,
        FunctionContext context)
    {
        _logger.LogInformation("Processing incident message.");

        try
        {
            var monitoringResult = JsonSerializer.Deserialize<MonitoringResult>(message);
            if (monitoringResult == null)
            {
                throw new InvalidOperationException("Failed to deserialize incident message.");
            }

            var incidentId = monitoringResult.ResourceId; // Use ResourceId as a unique identifier
            await _orchestrationService.HandleIncidentAsync(incidentId, monitoringResult);

            _logger.LogInformation("Incident {IncidentId} processed successfully.", incidentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing incident message.");
            throw;
        }
    }
}