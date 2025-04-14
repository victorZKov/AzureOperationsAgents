// Extracted Notification class to a separate file in the Core Models folder
namespace AzureOperationsAgents.Core.Models.Notifier;

public class Notification
{
    public string NotificationId { get; set; } = string.Empty;
    public string IncidentId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<string> Audience { get; set; } = new();
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, object> Details { get; set; } = new();
}