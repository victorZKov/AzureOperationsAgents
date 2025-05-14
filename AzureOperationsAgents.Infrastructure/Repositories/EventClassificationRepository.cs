using AzureOperationsAgents.Core.Interfaces.Classification;
using AzureOperationsAgents.Core.Models.Classification;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Text.Json;
using AzureOperationsAgents.Imfrastructure.Interfaces;
using Microsoft.Extensions.Configuration;

public class SqlServerEventClassificationRepository : IEventClassificationRepository
{
    private readonly string _connectionString;

    public SqlServerEventClassificationRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("SqlServer") 
            ?? throw new ArgumentNullException("Missing connection string: SqlServer");
        EnsureTableExists();
    }

    private void EnsureTableExists()
    {
        using var connection = new SqlConnection(_connectionString);
        connection.Execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventClassification' AND xtype='U')
            CREATE TABLE EventClassification (
                Id NVARCHAR(50) PRIMARY KEY,
                EventId NVARCHAR(50),
                Source NVARCHAR(100),
                Timestamp DATETIME2,
                EventData NVARCHAR(MAX),
                Category NVARCHAR(100),
                Severity NVARCHAR(10),
                Confidence FLOAT,
                ClassificationReason NVARCHAR(MAX),
                SuggestedActions NVARCHAR(MAX)
            )
        """);
    }

    public async Task SaveAsync(EventClassification classification)
    {
        using var connection = new SqlConnection(_connectionString);
        var sql = """
            MERGE EventClassification AS target
            USING (SELECT @Id AS Id) AS source
            ON target.Id = source.Id
            WHEN MATCHED THEN
                UPDATE SET
                    EventId = @EventId,
                    Source = @Source,
                    Timestamp = @Timestamp,
                    EventData = @EventData,
                    Category = @Category,
                    Severity = @Severity,
                    Confidence = @Confidence,
                    ClassificationReason = @ClassificationReason,
                    SuggestedActions = @SuggestedActions
            WHEN NOT MATCHED THEN
                INSERT (Id, EventId, Source, Timestamp, EventData, Category, Severity, Confidence, ClassificationReason, SuggestedActions)
                VALUES (@Id, @EventId, @Source, @Timestamp, @EventData, @Category, @Severity, @Confidence, @ClassificationReason, @SuggestedActions);
        """;

        await connection.ExecuteAsync(sql, new
        {
            classification.Id,
            classification.EventId,
            classification.Source,
            classification.Timestamp,
            EventData = JsonSerializer.Serialize(classification.EventData),
            classification.Category,
            classification.Severity,
            classification.Confidence,
            classification.ClassificationReason,
            SuggestedActions = JsonSerializer.Serialize(classification.SuggestedActions)
        });
    }

    public async Task<EventClassification?> GetByIdAsync(string id)
    {
        using var connection = new SqlConnection(_connectionString);
        var row = await connection.QuerySingleOrDefaultAsync<dynamic>(
            "SELECT * FROM EventClassification WHERE Id = @Id", new { Id = id });

        return row is null ? null : Map(row);
    }

    public async Task<List<EventClassification>> GetByCategoryAsync(string category)
    {
        using var connection = new SqlConnection(_connectionString);
        var rows = await connection.QueryAsync<dynamic>(
            "SELECT * FROM EventClassification WHERE Category = @Category", new { Category = category });

        return rows.Select(Map).ToList();
    }

    public async Task<List<EventClassification>> GetBySeverityAsync(string severity)
    {
        using var connection = new SqlConnection(_connectionString);
        var rows = await connection.QueryAsync<dynamic>(
            "SELECT * FROM EventClassification WHERE Severity = @Severity", new { Severity = severity });

        return rows.Select(Map).ToList();
    }

    private static EventClassification Map(dynamic row) => new()
    {
        Id = row.Id,
        EventId = row.EventId,
        Source = row.Source,
        Timestamp = row.Timestamp,
        EventData = JsonSerializer.Deserialize<Dictionary<string, object>>(row.EventData ?? "{}")!,
        Category = row.Category,
        Severity = row.Severity,
        Confidence = row.Confidence,
        ClassificationReason = row.ClassificationReason,
        SuggestedActions = JsonSerializer.Deserialize<List<string>>(row.SuggestedActions ?? "[]")!
    };
}