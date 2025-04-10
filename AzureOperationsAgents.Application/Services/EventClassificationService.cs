using Azure.AI.OpenAI;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Application.Services;

public class EventClassificationService : IEventClassificationService
{
    private readonly OpenAIClient _openAIClient;
    private readonly string _deploymentName;
    private readonly ILogger<EventClassificationService> _logger;

    public EventClassificationService(
        OpenAIClient openAIClient,
        string deploymentName,
        ILogger<EventClassificationService> logger)
    {
        _openAIClient = openAIClient;
        _deploymentName = deploymentName;
        _logger = logger;
    }

    public async Task<EventClassification> ClassifyEventAsync(EventClassification eventData)
    {
        try
        {
            var prompt = GenerateClassificationPrompt(eventData);
            
            var chatCompletions = await _openAIClient.GetChatCompletionsAsync(
                _deploymentName,
                new ChatCompletionsOptions
                {
                    Messages =
                    {
                        new ChatMessage(ChatRole.System, "Eres un experto en clasificación de eventos de Azure. Analiza el evento y proporciona una clasificación detallada."),
                        new ChatMessage(ChatRole.User, prompt)
                    },
                    Temperature = 0.7f,
                    MaxTokens = 800
                });

            var response = chatCompletions.Value.Choices[0].Message.Content;
            return ParseClassificationResponse(eventData, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al clasificar el evento {EventId}", eventData.EventId);
            throw;
        }
    }

    public Task<EventClassification> GetClassificationAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<List<EventClassification>> GetClassificationsByCategoryAsync(string category)
    {
        throw new NotImplementedException();
    }

    public Task<List<EventClassification>> GetClassificationsBySeverityAsync(string severity)
    {
        throw new NotImplementedException();
    }

    private string GenerateClassificationPrompt(EventClassification eventData)
    {
        return $@"
Evento a clasificar:
ID: {eventData.EventId}
Origen: {eventData.Source}
Timestamp: {eventData.Timestamp}
Datos del evento: {System.Text.Json.JsonSerializer.Serialize(eventData.EventData)}

Por favor, clasifica este evento proporcionando:
1. Categoría (ej: Seguridad, Rendimiento, Disponibilidad, etc.)
2. Severidad (Critical, High, Medium, Low)
3. Razón de la clasificación
4. Acciones sugeridas (lista de acciones recomendadas)
";
    }

    private EventClassification ParseClassificationResponse(EventClassification eventData, string response)
    {
        // Aquí implementaríamos la lógica para parsear la respuesta de OpenAI
        // y asignar los valores correspondientes al objeto EventClassification
        // Por simplicidad, estamos usando valores por defecto
        eventData.Category = "Seguridad";
        eventData.Severity = "High";
        eventData.Confidence = 0.95;
        eventData.ClassificationReason = "El evento muestra un patrón de comportamiento sospechoso";
        eventData.SuggestedActions = new List<string> { "Revisar logs de seguridad", "Notificar al equipo de seguridad" };

        return eventData;
    }
} 