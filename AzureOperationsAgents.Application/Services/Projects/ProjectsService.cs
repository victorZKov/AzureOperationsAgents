using AzureOperationsAgents.Core.Interfaces.Projects;
using AzureOperationsAgents.Core.Models.Projects;

namespace AzureOperationsAgents.Application.Services.Projects
{
    public class ProjectsService : IProjectsService
    {
        private readonly IProjectsRepository _repository;

        public ProjectsService(IProjectsRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Project>> GetProjectsAsync(string userId)
        {
            return await _repository.GetProjectsByUserAsync(userId);
        }

        public async Task<Project?> GetProjectByIdAsync(int projectId, string userId)
        {
            return await _repository.GetProjectByIdAsync(projectId, userId);
        }

        public async Task<Project> CreateProjectAsync(string userId, string name)
        {
            var newProject = new Project
            {
                Name = name,
                UserId = userId
            };
            return await _repository.CreateProjectAsync(newProject);
        }

        public async Task<bool> DeleteProjectAsync(int projectId, string userId)
        {
            return await _repository.DeleteProjectAsync(projectId, userId);
        }
    }
}