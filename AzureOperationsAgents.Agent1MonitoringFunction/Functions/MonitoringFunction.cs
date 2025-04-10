using System;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using AzureOperationsAgents.Core.Interfaces.Monitoring;
using AzureOperationsAgents.Core.Models.Monitoring;

namespace AzureOperationsAgents.Agent1MonitoringFunction.Functions
{
    public class MonitoringFunction
    {
        private readonly IMonitoringService _monitoringService;
        private readonly ILogger<MonitoringFunction> _logger;

        public MonitoringFunction(IMonitoringService monitoringService, ILogger<MonitoringFunction> logger)
        {
            _monitoringService = monitoringService;
            _logger = logger;
        }

        [Function("MonitorResources")]
        public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo timerInfo)
        {
            _logger.LogInformation($"Monitoring function executed at: {DateTime.Now}");

            try
            {
                // Example resource to monitor - you should get this from configuration
                string resourceId = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{webAppName}";
                string[] metrics = new[] { "CpuPercentage", "MemoryPercentage" };

                var result = await _monitoringService.MonitorResourceAsync(resourceId, metrics);

                if (result.Status == "Error" || (result.Metrics.ContainsKey("CpuPercentage") && result.Metrics["CpuPercentage"] > 80))
                {
                    var notification = new OrchestratorNotification
                    {
                        ResourceId = result.ResourceId,
                        AlertName = "High CPU Usage",
                        Description = $"CPU usage is at {result.Metrics["CpuPercentage"]}%",
                        Severity = "Warning",
                        Timestamp = DateTime.UtcNow,
                        Status = "Active",
                        MonitorCondition = "Fired"
                    };

                    await _monitoringService.SendNotificationAsync(notification);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in monitoring function: {ex.Message}");
                throw;
            }
        }
    }
} 