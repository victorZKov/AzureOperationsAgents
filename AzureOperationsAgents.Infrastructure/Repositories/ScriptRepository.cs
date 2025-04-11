using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure;
using Azure.Data.Tables;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Scripting;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.Infrastructure.Repositories;

public class ScriptRepository : IScriptRepository
{
    private readonly TableClient _tableClient;

    public ScriptRepository(IConfiguration config)
    {
        var connection = config["AzureWebJobsStorage"];
        _tableClient = new TableClient(connection, "Scripts");
        _tableClient.CreateIfNotExists();
    }

    public async Task<Script> GetByIdAsync(Guid id)
    {
        try
        {
            var response = await _tableClient.GetEntityAsync<ScriptEntity>("Scripts", id.ToString());
            return response.Value.ToScript();
        }
        catch (Azure.RequestFailedException)
        {
            return null;
        }
    }

    public async Task<IEnumerable<Script>> GetAllAsync()
    {
        var scripts = new List<Script>();
        var results = _tableClient.QueryAsync<ScriptEntity>(filter: "");

        await foreach (var entity in results)
        {
            scripts.Add(entity.ToScript());
        }

        return scripts;
    }

    public async Task<Script> AddAsync(Script script)
    {
        var entity = ScriptEntity.FromScript(script);
        await _tableClient.AddEntityAsync(entity);
        return script;
    }

    public async Task<Script> UpdateAsync(Script script)
    {
        var entity = ScriptEntity.FromScript(script);
        await _tableClient.UpdateEntityAsync(entity, ETag.All);
        return script;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        try
        {
            await _tableClient.DeleteEntityAsync("Scripts", id.ToString());
            return true;
        }
        catch (Azure.RequestFailedException)
        {
            return false;
        }
    }

    public async Task<IEnumerable<Script>> FindSimilarAsync(string content)
    {
        // Implementación básica: devuelve todos los scripts
        // En una implementación real, podrías usar Azure Cognitive Search o similar
        return await GetAllAsync();
    }
}

public class ScriptEntity : ITableEntity
{
    public required string PartitionKey { get; set; }
    public required string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    public required string Name { get; set; }
    public required string Content { get; set; }
    public required string Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public bool IsSuccessful { get; set; }
    public string? ErrorMessage { get; set; }

    public static ScriptEntity FromScript(Script script)
    {
        if (script == null) throw new ArgumentNullException(nameof(script));
        
        return new ScriptEntity
        {
            PartitionKey = "Scripts",
            RowKey = script.Id.ToString(),
            Name = script.Name,
            Content = script.Content,
            Type = script.Type.ToString(),
            CreatedAt = script.CreatedAt,
            LastModifiedAt = script.LastModifiedAt,
            IsSuccessful = script.IsSuccessful,
            ErrorMessage = script.ErrorMessage
        };
    }

    public Script ToScript()
    {
        return new Script
        {
            Id = Guid.Parse(RowKey),
            Name = Name,
            Content = Content,
            Type = Enum.Parse<ScriptType>(Type),
            CreatedAt = CreatedAt,
            LastModifiedAt = LastModifiedAt,
            IsSuccessful = IsSuccessful,
            ErrorMessage = ErrorMessage
        };
    }
} 