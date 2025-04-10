using Azure;
using Azure.Data.Tables;
using AzureOperationsAgents.Core.Models.Scripting;
using AzureOperationsAgents.Infrastructure.Repositories;
using Moq;
using Xunit;

namespace AzureOperationsAgents.Tests.Repositories
{
    public class ScriptRepositoryTests
    {
        private readonly string _connectionString = "UseDevelopmentStorage=true";
        private readonly ScriptRepository _repository;

        public ScriptRepositoryTests()
        {
            _repository = new ScriptRepository(_connectionString);
        }

        [Fact]
        public async Task AddAsync_WithValidScript_ReturnsScript()
        {
            // Arrange
            var script = new Script
            {
                Id = Guid.NewGuid(),
                Name = "Test Script",
                Content = "Test script content",
                Type = ScriptType.PowerShell,
                CreatedAt = DateTime.UtcNow,
                IsSuccessful = true
            };

            // Act
            var result = await _repository.AddAsync(script);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(script.Id, result.Id);
            Assert.Equal(script.Content, result.Content);
            Assert.Equal(script.Type, result.Type);
        }

        [Fact]
        public async Task GetByIdAsync_WithValidId_ReturnsScript()
        {
            // Arrange
            var script = new Script
            {
                Id = Guid.NewGuid(),
                Name = "Test Script",
                Content = "Test script content",
                Type = ScriptType.PowerShell,
                CreatedAt = DateTime.UtcNow,
                IsSuccessful = true
            };

            await _repository.AddAsync(script);

            // Act
            var result = await _repository.GetByIdAsync(script.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(script.Id, result.Id);
            Assert.Equal(script.Content, result.Content);
            Assert.Equal(script.Type, result.Type);
        }

        [Fact]
        public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
        {
            // Act
            var result = await _repository.GetByIdAsync(Guid.NewGuid());

            // Assert
            Assert.Null(result);
        }
    }
} 