using AzureOperationsAgents.Core.Models.Projects;

namespace AzureOperationsAgents.Core.Interfaces.Projects
{
    public interface IProjectsService
    {
        Task<IEnumerable<Project>> GetProjectsAsync(string userId);
        Task<Project?> GetProjectByIdAsync(int projectId, string userId);
        Task<Project> CreateProjectAsync(string userId, string name);
        Task<bool> DeleteProjectAsync(int projectId, string userId);
    }
}