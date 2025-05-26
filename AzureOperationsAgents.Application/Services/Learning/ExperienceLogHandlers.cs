using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Core.Models;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Application.Services
{
    public class LogExperienceCommandHandler : ILogExperienceCommandHandler
    {
        private readonly IExperienceLogRepository _repository;

        public LogExperienceCommandHandler(IExperienceLogRepository repository)
        {
            _repository = repository;
        }

        public async Task LogExperienceAsync(ExperienceLog experienceLog)
        {
            await _repository.AddExperienceLogAsync(experienceLog);
        }
    }

    public class GetExperienceRecommendationsQueryHandler : IGetExperienceRecommendationsQueryHandler
    {
        private readonly IExperienceLogRepository _repository;

        public GetExperienceRecommendationsQueryHandler(IExperienceLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ExperienceLog>> GetRecommendationsAsync(int count)
        {
            return await _repository.GetLatestExperienceLogsAsync(count);
        }
    }
}