// filepath: /Users/victorzaragoza/Developer/k/agentfactory/agents/AzureOperationsAgents.Core/Models/Learning/WebSearchResult.cs
namespace AzureOperationsAgents.Core.Models.Learning;

public class WebSearchResult
{
    /// <summary>
    /// The title of the search result
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// The URL of the search result
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// The snippet or summary text from the search result
    /// </summary>
    public string Snippet { get; set; } = string.Empty;
    
    /// <summary>
    /// The source of the search result (e.g., Bing, Google)
    /// </summary>
    public string Source { get; set; } = string.Empty;
}
