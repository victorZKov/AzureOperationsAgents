using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IExperienceLogRepository
{
    Task AddExperienceLogAsync(ExperienceLog experienceLog);
    Task<IEnumerable<ExperienceLog>> GetLatestExperienceLogsAsync(int count);
}