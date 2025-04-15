using AzureOperationsAgents.Core.Models;
using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Interfaces.Learning;
using Container = Microsoft.Azure.Cosmos.Container;

namespace AzureOperationsAgents.Infrastructure.Repositories
{
    public class ExperienceLogRepository : IExperienceLogRepository
    {
        private readonly Container _container;

        public ExperienceLogRepository(CosmosClient cosmosClient)
        {
            _container = cosmosClient.GetContainer("AgentLearning", "experienceLogs");
        }


        public async Task AddExperienceLogAsync(ExperienceLog experienceLog)
        {
            await _container.CreateItemAsync(experienceLog, new PartitionKey(experienceLog.AgentId));
        }

        public async Task<IEnumerable<ExperienceLog>> GetLatestExperienceLogsAsync(int count)
        {
            var query = new QueryDefinition("SELECT * FROM c ORDER BY c.Timestamp DESC");
            var iterator = _container.GetItemQueryIterator<ExperienceLog>(query, requestOptions: new QueryRequestOptions { MaxItemCount = count });

            var results = new List<ExperienceLog>();
            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response);
            }

            return results.Take(count);
        }
    }
}