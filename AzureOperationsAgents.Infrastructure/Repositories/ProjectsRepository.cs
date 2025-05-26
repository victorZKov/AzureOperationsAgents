using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Interfaces.Projects;
using AzureOperationsAgents.Core.Models.Projects;
using Microsoft.EntityFrameworkCore;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class ProjectsRepository : IProjectsRepository
    {
        private readonly AzureOperationsDbContext _context;

        public ProjectsRepository(AzureOperationsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Project>> GetProjectsByUserAsync(string userId)
        {
            return await _context.Projects
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task<Project?> GetProjectByIdAsync(int projectId, string userId)
        {
            return await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        }

        public async Task<Project> CreateProjectAsync(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<bool> DeleteProjectAsync(int projectId, string userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}