using System.Text.Json;
using AzureOperationsAgents.Application.Services.Auditing;
using AzureOperationsAgents.Core.Models.Auditing;
using AzureOperationsAgents.Core.Models.Notifier;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace AzureOperationsAgents.Agent5Notifier.Functions;

public class NotificationFunction
{
    private readonly AuditEventService _auditService;
    private readonly ILogger<NotificationFunction> _logger;

    public NotificationFunction(AuditEventService auditService, ILogger<NotificationFunction> logger)
    {
        _auditService = auditService;
        _logger = logger;
    }

    [Function("ProcessNotification")]
    public async Task RunAsync(
        [ServiceBusTrigger("notifications", Connection = "ServiceBusConnection")] string message,
        FunctionContext context)
    {
        _logger.LogInformation("Processing notification message.");

        try
        {
            var notification = JsonSerializer.Deserialize<Notification>(message);
            if (notification == null)
            {
                throw new InvalidOperationException("Failed to deserialize notification message.");
            }

            // Simulate sending notification (e.g., email, Teams, webhook)
            _logger.LogInformation($"Sending notification to: {string.Join(", ", notification.Audience)}");

            // Log the notification to Agent4 (Auditing)
            var auditEvent = new AuditEvent
            {
                AgentName = "Agent5Notifier",
                Message = $"Notification sent: {notification.Message}",
                Timestamp = DateTimeOffset.UtcNow
            };

            await _auditService.SaveAsync(auditEvent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing notification message.");
            throw;
        }
    }
}