using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Files;
using AzureOperationsAgents.Core.Models.Files;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker.Http;
using Newtonsoft.Json;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class FilesFunctions
{
    private readonly ILogger<FilesFunctions> _logger;
    private readonly IFilesService _filesService;

    public FilesFunctions(ILogger<FilesFunctions> logger, IFilesService filesService)
    {
        _logger = logger;
        _filesService = filesService;
    }

    [Function("GetFolders")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route= "folder/list")] HttpRequestData req)
    {
        _logger.LogInformation("GetFolders :: Start");
        
        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("GetFolders :: UserId is null or empty");
            return new UnauthorizedResult();
        }

        try
        {
            var root = 0;
            var parentFolderId = req.Query["parentFolderId"];
            if (!string.IsNullOrEmpty(parentFolderId))
            {
                root = int.Parse(parentFolderId);
            }

            var folders = await _filesService.GetFoldersAsync(userId, root);
            _logger.LogInformation($"GetFolders :: Folders count: {folders.Count}");
            return new OkObjectResult(folders);
        }
        catch (Exception ex)
        {
            _logger.LogError($"GetFolders :: Error: {ex.Message}");
            return new BadRequestObjectResult($"500-{ex.Message}");
        }

    }
        
    [Function("GetFiles")]
    public async Task<IActionResult> GetFiles([HttpTrigger(AuthorizationLevel.Function, "get", Route = "file/list")] HttpRequestData req)
    {
        _logger.LogInformation("GetFiles :: Start");

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("GetFiles :: UserId is null or empty");
            return new UnauthorizedResult();
        }

        try
        {
            var root = 0;
            var parentFolderId = req.Query["parentFolderId"];
            if (!string.IsNullOrEmpty(parentFolderId))
            {
                root = int.Parse(parentFolderId);
            }

            var files = await _filesService.GetFilesAsync(userId, root);

            return new OkObjectResult(files);
        }
        catch (Exception ex)
        {
            _logger.LogError($"GetFiles :: Error: {ex.Message}");
            return new BadRequestObjectResult($"500-{ex.Message}");
        }
    }
    
    [Function("GetFolder")]
    public async Task<IActionResult> GetFolder([HttpTrigger(AuthorizationLevel.Function, "get", Route = "folder/details/{folderId}")] HttpRequestData req, int folderId)
    {
        _logger.LogInformation($"GetFolder :: Start for folderId: {folderId}");

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("GetFolder :: UserId is null or empty");
            return new UnauthorizedResult();
        }

        try
        {
            var folder = await _filesService.GetFolderAsync(userId, folderId);
            return new OkObjectResult(folder);
        }
        catch (Exception ex)
        {
            _logger.LogError($"GetFolder :: Error: {ex.Message}");
            return new BadRequestObjectResult($"500-{ex.Message}");
        }
    }

    [Function("DeleteFolder")]
    public async Task<IActionResult> DeleteFolder([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "folder/delete/{folderId}")] HttpRequestData req, int folderId)
    {
        _logger.LogInformation($"DeleteFolder :: Start for folderId: {folderId}");

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("DeleteFolder :: UserId is null or empty");
            return new UnauthorizedResult();
        }

        try
        {
            await _filesService.DeleteFolderAsync(userId, folderId);
            return new OkResult();
        }
        catch (Exception ex)
        {
            _logger.LogError($"DeleteFolder :: Error: {ex.Message}");
            return new BadRequestObjectResult($"500-{ex.Message}");
        }
    }
    
    [Function("CreateFolder")]
    public async Task<IActionResult> CreateFolder([HttpTrigger(AuthorizationLevel.Function, "post", Route = "folder/new")] HttpRequestData req)
    {
        _logger.LogInformation("CreateFolder :: Start");

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("CreateFolder :: UserId is null or empty");
            return new UnauthorizedResult();
        }

        try
        {
            var payload = await req.ReadAsStringAsync();
            if (payload != null)
            {
                var newFolderPayload = JsonConvert.DeserializeObject<NewFolderPayload>(payload);

                if (newFolderPayload != null)
                    await _filesService.CreateFolderAsync(userId, newFolderPayload.Name??"folder", newFolderPayload.ParentFolderId);
            }

            return new OkResult();
        }
        catch (Exception ex)
        {
            _logger.LogError($"CreateFolder :: Error: {ex.Message}");
            return new BadRequestObjectResult($"500-{ex.Message}");
        }
    }
    
    [Function("CreateFile")]
    public async Task<IActionResult> CreateFile([HttpTrigger(AuthorizationLevel.Function, "post", Route = "file/upload")] HttpRequestData req)
    {
        _logger.LogInformation("CreateFile :: Start");

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("CreateFile :: UserId is null or empty");
            return new UnauthorizedResult();
        }

        try
        {
            var payload = await req.ReadAsStringAsync();

            if (payload != null)
            {
                var newFilePayload = JsonConvert.DeserializeObject<FileDto>(payload);

                if (newFilePayload != null)
                {
                    newFilePayload.Owner = userId;
                    newFilePayload.FolderId = newFilePayload.ParentId;
                    var result = await _filesService.CreateFileAsync(userId, newFilePayload);
                    
                    return new CreatedResult(result.Url, result);

                }
            }
        
            return new BadRequestResult();
        }
        catch (Exception ex)
        {
            _logger.LogError($"CreateFile :: Error: {ex.Message}");
            return new BadRequestObjectResult($"500-{ex.Message}");
        }
    }
}