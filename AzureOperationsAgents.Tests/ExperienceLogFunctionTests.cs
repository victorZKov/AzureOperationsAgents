using AzureOperationsAgents.Application.Interfaces;
using AzureOperationsAgents.Core.Models;
using AzureOperationsAgents.Agent7Learning;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using System.Threading.Tasks;

namespace AzureOperationsAgents.Tests
{
    public class LogExperienceFromServiceBusTests
    {
        [Fact]
        public async Task RunAsync_ValidMessage_LogsExperience()
        {
            // Arrange
            var mockHandler = new Mock<ILogExperienceCommandHandler>();
            var mockLogger = new Mock<ILogger<LogExperienceFromServiceBus>>();
            var function = new LogExperienceFromServiceBus(mockHandler.Object, mockLogger.Object);

            var message = "{ \"Id\": \"1\", \"AgentId\": \"Agent123\", \"Timestamp\": \"2025-04-15T00:00:00Z\", \"Content\": \"Test Content\", \"Type\": \"Test Type\" }";

            // Act
            await function.RunAsync(message, null);

            // Assert
            mockHandler.Verify(h => h.LogExperienceAsync(It.IsAny<ExperienceLog>()), Times.Once);
        }
    }

    public class GetExperienceRecommendationsTests
    {
        [Fact]
        public async Task RunAsync_ReturnsRecommendations()
        {
            // Arrange
            var mockHandler = new Mock<IGetExperienceRecommendationsQueryHandler>();
            var mockLogger = new Mock<ILogger<GetExperienceRecommendations>>();
            var function = new GetExperienceRecommendations(mockHandler.Object, mockLogger.Object);

            var mockRequest = new Mock<Microsoft.Azure.Functions.Worker.Http.HttpRequestData>(null);
            mockRequest.Setup(r => r.CreateResponse(It.IsAny<System.Net.HttpStatusCode>())).Returns(new Mock<Microsoft.Azure.Functions.Worker.Http.HttpResponseData>(null).Object);

            mockHandler.Setup(h => h.GetRecommendationsAsync(50)).ReturnsAsync(new[] { new ExperienceLog { Id = "1", AgentId = "Agent123", Timestamp = System.DateTime.UtcNow, Content = "Test Content", Type = "Test Type" } });

            // Act
            var response = await function.RunAsync(mockRequest.Object, null);

            // Assert
            Assert.NotNull(response);
            mockHandler.Verify(h => h.GetRecommendationsAsync(50), Times.Once);
        }
    }
}