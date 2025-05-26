// File: AzureOperationsAgents.Application/Services/Learning/SerperWebSearchService.cs

using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace AzureOperationsAgents.Application.Services.Learning;

public class SerperWebSearchService : IWebSearchService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _searchEndpoint;

    public SerperWebSearchService(IConfiguration configuration)
    {
        _httpClient = new HttpClient();
        _apiKey = configuration["SerperApiKey"] ?? throw new ArgumentNullException("Serper:ApiKey configuration is missing");
        _searchEndpoint = configuration["SerperEndpoint"] ?? "https://google.serper.dev/search";
    }

    public async Task<IEnumerable<WebSearchResult>> SearchAsync(string query, CancellationToken cancellationToken)
    {
        var payload = JsonSerializer.Serialize(new { q = query });
        var request = new HttpRequestMessage(HttpMethod.Post, _searchEndpoint)
        {
            Content = new StringContent(payload, System.Text.Encoding.UTF8, "application/json")
        };
        request.Headers.Add("X-API-KEY", _apiKey);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var jsonDoc = JsonDocument.Parse(content);

        var results = new List<WebSearchResult>();

        if (jsonDoc.RootElement.TryGetProperty("organic", out var organicResults))
        {
            foreach (var item in organicResults.EnumerateArray())
            {
                results.Add(new WebSearchResult
                {
                    Title = item.GetProperty("title").GetString() ?? string.Empty,
                    Snippet = item.GetProperty("snippet").GetString() ?? string.Empty,
                    Url = item.GetProperty("link").GetString() ?? string.Empty
                });
            }
        }

        return results;
    }
}