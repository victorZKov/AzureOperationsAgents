using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AzureScriptingAPI.Core.Models;

namespace AzureScriptingAPI.Core.Interfaces;

public interface IScriptRepository
{
    Task<Script> GetByIdAsync(Guid id);
    Task<IEnumerable<Script>> GetAllAsync();
    Task<Script> AddAsync(Script script);
    Task<Script> UpdateAsync(Script script);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<Script>> FindSimilarAsync(string content);
} 