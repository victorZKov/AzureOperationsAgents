using System.Text.Json;
using AzureOperationsAgents.Application.Services.Auditing;
using AzureOperationsAgents.Core.Models.Auditing;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AzureOperationsAgents.Agent5Notifier.Tests;

public class NotificationFunctionTests
{
    private readonly Mock<AuditEventService> _auditServiceMock;
    private readonly Mock<ILogger<NotificationFunction>> _loggerMock;
    private readonly NotificationFunction _function;

    public NotificationFunctionTests()
    {
        _auditServiceMock = new Mock<AuditEventService>(MockBehavior.Strict);
        _loggerMock = new Mock<ILogger<NotificationFunction>>();
        _function = new NotificationFunction(_auditServiceMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task RunAsync_ValidNotification_LogsAndSavesAuditEvent()
    {
        // Arrange
        var notification = new Notification
        {
            NotificationId = "ntf123",
            IncidentId = "inc456",
            Type = "ExecutionResult",
            Audience = new List<string> { "admin@company.com" },
            Message = "Script executed successfully."
        };

        var message = JsonSerializer.Serialize(notification);

        _auditServiceMock
            .Setup(x => x.SaveAsync(It.IsAny<AuditEvent>()))
            .Returns(Task.CompletedTask);

        // Act
        await _function.RunAsync(message, null);

        // Assert
        _auditServiceMock.Verify(x => x.SaveAsync(It.Is<AuditEvent>(e => e.Message.Contains(notification.Message))), Times.Once);
    }

    [Fact]
    public async Task RunAsync_InvalidNotification_ThrowsException()
    {
        // Arrange
        var invalidMessage = "Invalid JSON";

        // Act & Assert
        await Assert.ThrowsAsync<JsonException>(() => _function.RunAsync(invalidMessage, null));
    }
}