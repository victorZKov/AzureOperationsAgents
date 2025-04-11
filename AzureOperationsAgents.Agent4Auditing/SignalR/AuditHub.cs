using Microsoft.AspNetCore.SignalR;

namespace AzureOperationsAgents.Agent4Auditing.SignalR
{
    public class AuditHub : Hub
    {
        // Optional: Called when a client connects
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            return base.OnConnectedAsync();
        }

        // Optional: Called when a client disconnects
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            return base.OnDisconnectedAsync(exception);
        }

        // Method to send audit event to all connected clients
        public async Task BroadcastAuditEvent(object auditEvent)
        {
            await Clients.All.SendAsync("ReceiveAuditEvent", auditEvent);
        }
    }
}