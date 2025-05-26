using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Entities;
using AzureOperationsAgents.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class ModelRepository : IModelRepository
    {
        private readonly AzureOperationsDbContext _context;

        public ModelRepository(AzureOperationsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ModelEntity>> GetAllModelsAsync()
        {
            // In a real application, this would query the database.
            // For now, we return a predefined list.
            // Ensure this matches the seeding in DbContext if you add it there.
            if (!await _context.Models.AnyAsync())
            {
                _context.Models.AddRange(GetPredefinedModels());
                await _context.SaveChangesAsync();
            }
            return await _context.Models.ToListAsync();
        }

        public async Task<IEnumerable<ModelEntity>> GetModelsByEngineAsync(string engineName)
        {
            if (!await _context.Models.AnyAsync())
            {
                 _context.Models.AddRange(GetPredefinedModels());
                await _context.SaveChangesAsync();
            }
            return await _context.Models.Where(m => m.EngineName == engineName).ToListAsync();
        }

        private static List<ModelEntity> GetPredefinedModels()
        {
            return new List<ModelEntity>
            {
                new ModelEntity { EngineName = "OpenAI", ModelName = "gpt-4" },
                new ModelEntity { EngineName = "OpenAI", ModelName = "gpt-4o" },
                new ModelEntity { EngineName = "OpenAI", ModelName = "gpt-3.5-turbo" },
                new ModelEntity { EngineName = "Ollama", ModelName = "mistral:latest" },
                new ModelEntity { EngineName = "Ollama", ModelName = "deepseek-r1:latest" },
                new ModelEntity { EngineName = "Ollama", ModelName = "qwen3:4b" },
                new ModelEntity {  EngineName = "Ollama", ModelName = "deepseek-r1:8b" }
            };
        }
    }
}

