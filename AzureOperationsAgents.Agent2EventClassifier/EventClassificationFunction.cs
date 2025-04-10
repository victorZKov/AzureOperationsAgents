using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using AzureOperationsAgents.Core.Interfaces.Classification;
using AzureOperationsAgents.Core.Models.Classification;

namespace AzureOperationsAgents.Agent2EventClassifier;

public class EventClassificationFunction
{
    private readonly IEventClassificationService _classificationService;
    private readonly ILogger<EventClassificationFunction> _logger;

    public EventClassificationFunction(
        IEventClassificationService classificationService,
        ILogger<EventClassificationFunction> logger)
    {
        _classificationService = classificationService;
        _logger = logger;
    }

    [Function("ProcessEvent")]
    [ServiceBusOutput("classified-events", Connection = "ServiceBusConnection")]
    public async Task<string> Run(
        [ServiceBusTrigger("events-to-classify", Connection = "ServiceBusConnection")]
        ServiceBusReceivedMessage message)
    {
        try
        {
            _logger.LogInformation("Procesando evento para clasificación");
            
            var eventData = JsonSerializer.Deserialize<EventClassification>(message.Body.ToString());
            if (eventData == null)
            {
                throw new InvalidOperationException("No se pudo deserializar el evento");
            }

            var classification = await _classificationService.ClassifyEventAsync(eventData);
            var response = JsonSerializer.Serialize(classification);

            _logger.LogInformation("Evento clasificado exitosamente: {EventId}", classification.EventId);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al procesar el evento");
            throw;
        }
    }
} 