using System.Text.Json;
using Azure.Messaging.ServiceBus;
using AzureOperationsAgents.Core.Interfaces.Execution;
using AzureOperationsAgents.Core.Models.Execution;
using Microsoft.Azure.Functions.Worker;

namespace AzureOperationsAgents.Agent3Runner.Functions;

public class ScriptExecutionFunction
{
    private readonly IScriptExecutionService _executionService;
    private readonly ILogger<ScriptExecutionFunction> _logger;

    public ScriptExecutionFunction(
        IScriptExecutionService executionService,
        ILogger<ScriptExecutionFunction> logger)
    {
        _executionService = executionService;
        _logger = logger;
    }

    [Function("ExecuteScript")]
    [ServiceBusOutput("script-execution-results", Connection = "ServiceBusConnection")]
    public async Task<string> Run(
        [ServiceBusTrigger("scripts-to-execute", Connection = "ServiceBusConnection")]
        ServiceBusReceivedMessage message)
    {
        try
        {
            _logger.LogInformation("Procesando solicitud de ejecución de script");
            
            var execution = JsonSerializer.Deserialize<ScriptExecution>(message.Body.ToString());
            if (execution == null)
            {
                throw new InvalidOperationException("No se pudo deserializar la solicitud de ejecución");
            }

            var result = await _executionService.ExecuteScriptAsync(execution);
            var response = JsonSerializer.Serialize(result);

            _logger.LogInformation("Script ejecutado exitosamente: {ScriptId}", execution.ScriptId);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al procesar la solicitud de ejecución");
            throw;
        }
    }
} 