using AzureOperationsAgents.Core.Models.Projects;

namespace AzureOperationsAgents.Core.Interfaces.Projects;

public interface IProjectsRepository
{
    Task<IEnumerable<Project>> GetProjectsByUserAsync(string userId);
    Task<Project?> GetProjectByIdAsync(int projectId, string userId);
    Task<Project> CreateProjectAsync(Project project);
    Task<bool> DeleteProjectAsync(int projectId, string userId);
}