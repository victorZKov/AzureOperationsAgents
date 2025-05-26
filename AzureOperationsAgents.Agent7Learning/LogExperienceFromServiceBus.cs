using AzureOperationsAgents.Application.Interfaces;
using AzureOperationsAgents.Core.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Agent7Learning
{
    public class LogExperienceFromServiceBus
    {
        private readonly ILogExperienceCommandHandler _handler;
        private readonly ILogger<LogExperienceFromServiceBus> _logger;

        public LogExperienceFromServiceBus(ILogExperienceCommandHandler handler, ILogger<LogExperienceFromServiceBus> logger)
        {
            _handler = handler;
            _logger = logger;
        }

        [Function("LogExperienceFromServiceBus")]
        public async Task RunAsync(
            [ServiceBusTrigger("agent-events", Connection = "ServiceBusConnection")] string message,
            FunctionContext context)
        {
            try
            {
                var experienceLog = JsonSerializer.Deserialize<ExperienceLog>(message);
                if (experienceLog != null)
                {
                    await _handler.LogExperienceAsync(experienceLog);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Service Bus message");
            }
        }
    }
}