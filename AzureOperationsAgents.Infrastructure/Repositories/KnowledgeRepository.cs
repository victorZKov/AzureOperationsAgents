using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;
using Microsoft.EntityFrameworkCore;

namespace AzureOperationsAgents.Infrastructure.Repositories;

public class KnowledgeRepository : IKnowledgeRepository
{
    private readonly AzureOperationsDbContext _context;

    public KnowledgeRepository(AzureOperationsDbContext context)
    {
        _context = context;
    }

    public async Task AddSnippetAsync(KnowledgeSnippet snippet)
    {
        _context.KnowledgeSnippets.Add(snippet);
        await _context.SaveChangesAsync();
    }

    public async Task<List<KnowledgeSnippet>> GetSnippetsByUserAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.KnowledgeSnippets
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }
}