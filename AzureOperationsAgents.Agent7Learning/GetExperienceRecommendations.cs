using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using AzureOperationsAgents.Core.Interfaces.Auditing;

namespace AzureOperationsAgents.Agent7Learning
{
    public class GetExperienceRecommendations
    {
        private readonly IGetExperienceRecommendationsQueryHandler _handler;
        private readonly ILogger<GetExperienceRecommendations> _logger;

        public GetExperienceRecommendations(IGetExperienceRecommendationsQueryHandler handler, ILogger<GetExperienceRecommendations> logger)
        {
            _handler = handler;
            _logger = logger;
        }

        [Function("GetExperienceRecommendations")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "experience/recommendations")] HttpRequestData req,
            FunctionContext context)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            try
            {
                var recommendations = await _handler.GetRecommendationsAsync(50);
                await response.WriteAsJsonAsync(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving experience recommendations");
                response = req.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return response;
        }
    }
}