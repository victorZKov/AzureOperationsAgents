using System.Threading.Tasks;
using AzureOperationsAgents.Core.Models.Monitoring;

namespace AzureOperationsAgents.Core.Interfaces.Monitoring
{
    public interface IMonitoringService
    {
        Task<MonitoringResult> MonitorResourceAsync(string resourceId, string[] metrics);
        Task SendNotificationAsync(OrchestratorNotification notification);
    }
} 