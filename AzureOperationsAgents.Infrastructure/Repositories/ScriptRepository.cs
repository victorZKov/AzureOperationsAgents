using System.Data;
using System.Data.SqlClient;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Core.Models.Scripting;
using Dapper;
using Microsoft.Data.SqlClient;

namespace AzureOperationsAgents.Infrastructure.Repositories;

public class ScriptRepository : IScriptRepository
{
    private readonly string _connectionString;

    public ScriptRepository(string connectionString)
    {
        _connectionString = connectionString;
        EnsureTableExists().GetAwaiter().GetResult(); // síncrono en constructor
    }

    private async Task EnsureTableExists()
    {
        const string checkTableSql = @"
            IF NOT EXISTS (
                SELECT * FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'Scripts'
            )
            BEGIN
                CREATE TABLE Scripts (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Name NVARCHAR(255) NOT NULL,
                    Content NVARCHAR(MAX) NOT NULL,
                    Type NVARCHAR(50) NOT NULL,
                    CreatedAt DATETIME2 NOT NULL,
                    LastModifiedAt DATETIME2 NULL,
                    IsSuccessful BIT NOT NULL,
                    ErrorMessage NVARCHAR(MAX) NULL
                );

                CREATE INDEX IX_Scripts_Type ON Scripts(Type);
                CREATE INDEX IX_Scripts_CreatedAt ON Scripts(CreatedAt);
            END";

        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(checkTableSql);
    }

    public async Task<Script> AddAsync(Script script)
    {
        const string sql = @"
            INSERT INTO Scripts (Id, Name, Content, Type, CreatedAt, LastModifiedAt, IsSuccessful, ErrorMessage)
            VALUES (@Id, @Name, @Content, @Type, @CreatedAt, @LastModifiedAt, @IsSuccessful, @ErrorMessage)";
        
        script.Id = Guid.NewGuid();
        script.CreatedAt = DateTime.UtcNow;

        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(sql, script);

        return script;
    }

    public async Task<Script> UpdateAsync(Script script)
    {
        const string sql = @"
            UPDATE Scripts
            SET Name = @Name,
                Content = @Content,
                Type = @Type,
                LastModifiedAt = @LastModifiedAt,
                IsSuccessful = @IsSuccessful,
                ErrorMessage = @ErrorMessage
            WHERE Id = @Id";

        script.LastModifiedAt ??= DateTime.UtcNow;

        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(sql, script);

        return script;
    }

    public async Task<Script?> GetByIdAsync(Guid id)
    {
        const string sql = "SELECT * FROM Scripts WHERE Id = @Id";

        using var connection = new SqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<Script>(sql, new { Id = id });
    }

    public async Task<IEnumerable<Script>> GetAllAsync()
    {
        const string sql = "SELECT * FROM Scripts";

        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<Script>(sql);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        const string sql = "DELETE FROM Scripts WHERE Id = @Id";

        using var connection = new SqlConnection(_connectionString);
        var affected = await connection.ExecuteAsync(sql, new { Id = id });
        return affected > 0;
    }

    public async Task<IEnumerable<Script>> FindSimilarAsync(string content)
    {
        // Placeholder — Devuelve todos por ahora
        return await GetAllAsync();
    }
}