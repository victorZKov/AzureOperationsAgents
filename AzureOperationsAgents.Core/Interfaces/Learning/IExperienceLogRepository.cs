using AzureOperationsAgents.Core.Models;
using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IExperienceLogRepository
{
    Task AddExperienceLogAsync(ExperienceLog experienceLog);
    Task<IEnumerable<ExperienceLog>> GetLatestExperienceLogsAsync(int count);
}