
using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IWebSearchService
{
    /// <summary>
    /// Searches the web for relevant information related to the query.
    /// </summary>
    /// <param name="query">The search query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of web search results</returns>
    Task<IEnumerable<WebSearchResult>> SearchAsync(string query, CancellationToken cancellationToken);
}
