using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Net;
using System.IO;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using AzureOperationsAgents.Core.Interfaces.Projects;
using AzureOperationsAgents.Core.Models.Projects;
using System.Security.Claims;
using AzureOperationsAgents.Core.Helpers;

namespace AzureOperationsAgents.UI.Backend.Functions
{
    public class ProjectsFunctions
    {
        private readonly ILogger<ProjectsFunctions> _logger;
        private readonly IProjectsService _projectsService;

        public ProjectsFunctions(ILogger<ProjectsFunctions> logger, IProjectsService projectsService)
        {
            _logger = logger;
            _projectsService = projectsService;
        }

        [Function("GetProjects")]
        public async Task<HttpResponseData> GetProjects(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "projects")]
            HttpRequestData req,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var projects = await _projectsService.GetProjectsAsync(userId);
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(projects);
            return response;
        }

        [Function("CreateProject")]
        public async Task<HttpResponseData> CreateProject(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "projects")]
            HttpRequestData req,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var requestBody = await JsonSerializer.DeserializeAsync<CreateProjectRequest>(req.Body);

            if (requestBody is null || string.IsNullOrWhiteSpace(requestBody.Name))
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var project = await _projectsService.CreateProjectAsync(userId, requestBody.Name);
            var response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(project);
            return response;
        }

        [Function("DeleteProject")]
        public async Task<HttpResponseData> DeleteProject(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "projects/{id:int}")]
            HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
            if (string.IsNullOrEmpty(userId))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            var success = await _projectsService.DeleteProjectAsync(id, userId);
            var response = req.CreateResponse(success ? HttpStatusCode.NoContent : HttpStatusCode.NotFound);
            return response;
        }

        

        private class CreateProjectRequest
        {
            [JsonPropertyName("name")]
            public string Name { get; set; } = string.Empty;
        }
    }
}