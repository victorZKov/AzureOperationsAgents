using Azure.Data.Tables;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using Microsoft.Extensions.Logging;

namespace AzureOperationsAgents.Application.Services;

public class ScriptExecutionService : IScriptExecutionService
{
    private readonly TableClient _tableClient;
    private readonly ILogger<ScriptExecutionService> _logger;

    public ScriptExecutionService(
        TableClient tableClient,
        ILogger<ScriptExecutionService> logger)
    {
        _tableClient = tableClient;
        _logger = logger;
    }

    public async Task<ScriptExecution> ExecuteScriptAsync(ScriptExecution execution)
    {
        try
        {
            _logger.LogInformation("Iniciando ejecución del script {ScriptId}", execution.ScriptId);
            
            var startTime = DateTime.UtcNow;
            execution.ExecutionTime = startTime;
            execution.Status = "Running";

            // Aquí implementaríamos la lógica real de ejecución del script
            // Por ahora simulamos una ejecución exitosa
            await Task.Delay(1000); // Simulación de tiempo de ejecución

            execution.Status = "Completed";
            execution.Output = "Script ejecutado exitosamente";
            execution.Duration = DateTime.UtcNow - startTime;

            await SaveExecutionAsync(execution);
            _logger.LogInformation("Script ejecutado exitosamente: {ScriptId}", execution.ScriptId);

            return execution;
        }
        catch (Exception ex)
        {
            execution.Status = "Failed";
            execution.Error = ex.Message;
            execution.Duration = DateTime.UtcNow - execution.ExecutionTime;

            await SaveExecutionAsync(execution);
            _logger.LogError(ex, "Error al ejecutar el script {ScriptId}", execution.ScriptId);
            
            throw;
        }
    }

    public async Task<ScriptExecution> GetExecutionAsync(string id)
    {
        try
        {
            var response = await _tableClient.GetEntityAsync<TableEntity>("ScriptExecutions", id);
            return MapTableEntityToScriptExecution(response.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener la ejecución {Id}", id);
            throw;
        }
    }

    public async Task<List<ScriptExecution>> GetExecutionsByScriptIdAsync(string scriptId)
    {
        try
        {
            var query = _tableClient.QueryAsync<TableEntity>(filter: $"ScriptId eq '{scriptId}'");
            var executions = new List<ScriptExecution>();

            await foreach (var entity in query)
            {
                executions.Add(MapTableEntityToScriptExecution(entity));
            }

            return executions;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener ejecuciones del script {ScriptId}", scriptId);
            throw;
        }
    }

    public async Task<List<ScriptExecution>> GetExecutionsByStatusAsync(string status)
    {
        try
        {
            var query = _tableClient.QueryAsync<TableEntity>(filter: $"Status eq '{status}'");
            var executions = new List<ScriptExecution>();

            await foreach (var entity in query)
            {
                executions.Add(MapTableEntityToScriptExecution(entity));
            }

            return executions;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener ejecuciones con estado {Status}", status);
            throw;
        }
    }

    private async Task SaveExecutionAsync(ScriptExecution execution)
    {
        var entity = MapScriptExecutionToTableEntity(execution);
        await _tableClient.UpsertEntityAsync(entity);
    }

    private TableEntity MapScriptExecutionToTableEntity(ScriptExecution execution)
    {
        return new TableEntity("ScriptExecutions", execution.Id)
        {
            { "ScriptId", execution.ScriptId },
            { "ExecutionTime", execution.ExecutionTime },
            { "Status", execution.Status },
            { "Output", execution.Output },
            { "Error", execution.Error },
            { "Duration", execution.Duration.TotalMilliseconds },
            { "Parameters", System.Text.Json.JsonSerializer.Serialize(execution.Parameters) }
        };
    }

    private ScriptExecution MapTableEntityToScriptExecution(TableEntity entity)
    {
        return new ScriptExecution
        {
            Id = entity.RowKey,
            ScriptId = entity.GetString("ScriptId"),
            ExecutionTime = entity.GetDateTime("ExecutionTime").Value,
            Status = entity.GetString("Status"),
            Output = entity.GetString("Output"),
            Error = entity.GetString("Error"),
            Duration = TimeSpan.FromMilliseconds(entity.GetDouble("Duration").Value),
            Parameters = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(entity.GetString("Parameters"))
        };
    }
} 