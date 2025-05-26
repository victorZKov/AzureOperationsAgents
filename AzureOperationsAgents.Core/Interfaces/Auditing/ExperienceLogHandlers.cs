using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Core.Interfaces.Auditing
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