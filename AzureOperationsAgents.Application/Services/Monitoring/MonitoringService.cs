using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Azure.Identity;
using Azure.Monitor.Query;
using Azure.Messaging.ServiceBus;
using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Monitoring;
using AzureOperationsAgents.Core.Models.Monitoring;

namespace AzureOperationsAgents.Application.Services.Monitoring
{
    public class MonitoringService : IMonitoringService
    {
        private readonly MetricsQueryClient _metricsClient;
        private readonly ServiceBusClient _serviceBusClient;
        private readonly ServiceBusSender _serviceBusSender;
        private readonly string _serviceBusQueue;

        public MonitoringService(string serviceBusConnectionString, string queueName)
        {
            _metricsClient = new MetricsQueryClient(new DefaultAzureCredential());
            _serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
            _serviceBusQueue = queueName;
            _serviceBusSender = _serviceBusClient.CreateSender(_serviceBusQueue);
        }

        public async Task<MonitoringResult> MonitorResourceAsync(string resourceId, string[] metrics)
        {
            var result = new MonitoringResult
            {
                ResourceId = resourceId,
                ResourceName = string.Empty,
                ResourceType = string.Empty,
                Location = string.Empty,
                Status = "Unknown",
                Timestamp = DateTime.UtcNow
            };

            try
            {
                foreach (var metric in metrics)
                {
                    var response = await _metricsClient.QueryResourceAsync(
                        resourceId,
                        new[] { metric },
                        new MetricsQueryOptions
                        {
                            TimeRange = new QueryTimeRange(TimeSpan.FromHours(1)),
                            Granularity = TimeSpan.FromMinutes(5)
                        });

                    if (response.Value.Metrics.Count > 0)
                    {
                        var metricData = response.Value.Metrics[0];
                        var lastValue = metricData.TimeSeries[0].Values.LastOrDefault();
                        
                        if (lastValue != null)
                        {
                            result.Metrics[metric] = lastValue.Average ?? 0;
                        }
                    }
                }

                // Parse resource information from resourceId
                var parts = resourceId.Split('/');
                if (parts.Length >= 8)
                {
                    result.ResourceName = parts[^1];
                    result.ResourceType = $"{parts[^3]}/{parts[^2]}";
                    result.Location = ""; // Would need additional API call to get location
                }

                result.Status = "Healthy"; // You might want to implement your own health logic here
            }
            catch (Exception ex)
            {
                result.Status = "Error";
                result.ErrorMessage = $"Error monitoring resource: {ex.Message}";
                throw;
            }

            return result;
        }

        public async Task SendNotificationAsync(OrchestratorNotification notification)
        {
            try
            {
                var message = new ServiceBusMessage(JsonSerializer.Serialize(notification));
                await _serviceBusSender.SendMessageAsync(message);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error sending notification: {ex.Message}", ex);
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_serviceBusSender != null)
            {
                await _serviceBusSender.DisposeAsync();
            }

            if (_serviceBusClient != null)
            {
                await _serviceBusClient.DisposeAsync();
            }
        }
    }
} 