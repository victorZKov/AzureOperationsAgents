using Azure.Data.Tables;
using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Core.Models.Auditing;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.Infrastructure.Repositories;

public class AuditEventRepository : IAuditEventRepository
{
    private readonly TableClient _tableClient;
    
    public AuditEventRepository(IConfiguration config)
    {
        var connection = config["AzureWebJobsStorage"];
        _tableClient = new TableClient(connection, "AuditEvents");
        _tableClient.CreateIfNotExists();
    }

    public async Task SaveAsync(AuditEvent auditEvent)
    {
        await _tableClient.AddEntityAsync(auditEvent);
    }
}