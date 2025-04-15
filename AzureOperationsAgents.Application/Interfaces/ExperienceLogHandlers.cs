using AzureOperationsAgents.Core.Models;

namespace AzureOperationsAgents.Application.Interfaces
{
    public interface ILogExperienceCommandHandler
    {
        Task LogExperienceAsync(ExperienceLog experienceLog);
    }

    public interface IGetExperienceRecommendationsQueryHandler
    {
        Task<IEnumerable<ExperienceLog>> GetRecommendationsAsync(int count);
    }
}