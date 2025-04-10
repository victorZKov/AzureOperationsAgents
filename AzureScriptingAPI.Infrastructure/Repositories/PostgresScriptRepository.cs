using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AzureScriptingAPI.Core.Interfaces;
using AzureScriptingAPI.Core.Models;
using Npgsql;
using Dapper;

namespace AzureScriptingAPI.Infrastructure.Repositories;

public class PostgresScriptRepository : IScriptRepository
{
    private readonly string _connectionString;

    public PostgresScriptRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<Script> GetByIdAsync(Guid id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QuerySingleOrDefaultAsync<Script>(
            "SELECT * FROM Scripts WHERE Id = @Id",
            new { Id = id });
    }

    public async Task<IEnumerable<Script>> GetAllAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        return await connection.QueryAsync<Script>("SELECT * FROM Scripts");
    }

    public async Task<Script> AddAsync(Script script)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        script.Id = Guid.NewGuid();
        script.CreatedAt = DateTime.UtcNow;
        
        await connection.ExecuteAsync(
            @"INSERT INTO Scripts (Id, Name, Content, Type, CreatedAt, IsSuccessful, ErrorMessage) 
              VALUES (@Id, @Name, @Content, @Type, @CreatedAt, @IsSuccessful, @ErrorMessage)",
            script);
        
        return script;
    }

    public async Task<Script> UpdateAsync(Script script)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        script.LastModifiedAt = DateTime.UtcNow;
        
        await connection.ExecuteAsync(
            @"UPDATE Scripts 
              SET Name = @Name, Content = @Content, Type = @Type, 
                  LastModifiedAt = @LastModifiedAt, IsSuccessful = @IsSuccessful, 
                  ErrorMessage = @ErrorMessage
              WHERE Id = @Id",
            script);
        
        return script;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        var rowsAffected = await connection.ExecuteAsync(
            "DELETE FROM Scripts WHERE Id = @Id",
            new { Id = id });
        return rowsAffected > 0;
    }

    public async Task<IEnumerable<Script>> FindSimilarAsync(string content)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        // Usando la función de similitud de texto de PostgreSQL
        return await connection.QueryAsync<Script>(
            @"SELECT * FROM Scripts 
              WHERE similarity(Content, @Content) > 0.3 
              ORDER BY similarity(Content, @Content) DESC 
              LIMIT 5",
            new { Content = content });
    }
} 