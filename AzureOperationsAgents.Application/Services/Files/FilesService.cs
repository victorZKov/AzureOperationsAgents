using System.Dynamic;
using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Interfaces.Files;
using AzureOperationsAgents.Core.Models.Files;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using File = AzureOperationsAgents.Core.Models.Files.File;

namespace AzureOperationsAgents.Application.Services.Files;

public class FilesService: IFilesService
{
    private readonly ILogger<FilesService> _logger;
    private readonly AzureOperationsDbContext _context;

    public FilesService(AzureOperationsDbContext context, ILogger<FilesService> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    public async Task<List<Folder>> GetFoldersAsync(string userId, int root)
    {
        try
        {
            _logger.Log(LogLevel.Debug, $"GetFoldersAsync :: UserId [{userId}]");

            var folders = await _context.Folders
                .Where(x => 
                    (x.Owner == userId)
                 && (x.ParentId == root))
                .ToListAsync();

            if (folders == null)
            {
                return new List<Folder>();
            }
            
            return folders;
        }
        catch (Exception ex)
        {
            _logger.Log(LogLevel.Error, $"GetFoldersAsync :: {ex.Message}");
            throw;
        }
    }

    public async Task<Folder> GetFolderAsync(string userId, int folderId)
    {
        try
        {
            _logger.Log(LogLevel.Information, $"GetFolderAsync :: UserId [{userId}] - FolderId [{folderId}]");

            var folder = await _context.Folders
                .FirstOrDefaultAsync(x => x.Id == folderId);
            
            if (folder.Owner != userId)
            {
                _logger.Log(LogLevel.Error, $"GetFolderAsync :: User [{userId}] does not own folder [{folderId}]");
                throw new Exception("User does not own folder");
            }
            
            return folder;
                
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"GetFolderAsync :: {e.Message}");
            throw;
        }
    }

    public async Task DeleteFolderAsync(string userId, int folderId)
    {
        try
        {
            _logger.Log(LogLevel.Information, $"DeleteFolderAsync :: UserId [{userId}] - FolderId [{folderId}]");

            var folder = await _context.Folders
                .FirstOrDefaultAsync(x => x.Id == folderId);
            
            if (folder.Owner != userId)
            {
                _logger.Log(LogLevel.Error, $"DeleteFolderAsync :: User [{userId}] does not own folder [{folderId}]");
                throw new Exception("User does not own folder");
            }

            _context.Folders.Remove(folder);
            await _context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"DeleteFolderAsync :: {e.Message}");
            throw;  
        }
    }

    public async Task<List<File>> GetFilesAsync(string userId, int root)
    {
        try
        {
            _logger.Log(LogLevel.Debug, $"GetFilesAsync :: UserId [{userId}]");
            
            var files = await _context.Files
                .Where(x => 
                    ((x.Owner == userId)
                    && (x.FolderId == root)))
                .ToListAsync();
            
            if (files == null)
            {
                return new List<File>();
            }
            return files;
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"GetFilesAsync :: {e.Message}");
            throw;
        }
    }

    public async Task CreateFolderAsync(string userId, string name, int parentFolderId)
    {
        try
        {
            _logger.Log(LogLevel.Information, $"CreateFolderAsync :: UserId [{userId}] - Name [{name}] - ParentFolderId [{parentFolderId}]");
            
            var folder = new Folder
            {
                Owner = userId,
                Name = name,
                ParentId = parentFolderId,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now
            };
            
            await _context.Folders.AddAsync(folder);
            await _context.SaveChangesAsync();
            
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"CreateFolderAsync :: {e.Message}");
            throw;
        }
    }

    public async Task<File> CreateFileAsync(string userId, FileDto fileDto)
    {
        try
        {
            _logger.Log(LogLevel.Information, $"CreateFileAsync :: UserId [{userId}] - FileDto [{JsonConvert.SerializeObject(fileDto)}]");

            var file = fileDto.GetFile();
            file.Owner = userId;
            file.CreatedAt = DateTime.Now;
            file.ModifiedAt = DateTime.Now;
            
            file.Size = await GetSizeAsync(file.Url);
            file.Type = "image";
            
            await _context.Files.AddAsync(file);
            await _context.SaveChangesAsync();
            return file;
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"CreateFileAsync :: {e.Message}");
            throw;
        }
        
    }

    private async Task<double> GetSizeAsync(string fileUrl)
    {
        using (var client = new HttpClient())
        {
            var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, fileUrl));
            response.EnsureSuccessStatusCode();
            if (response.Content.Headers.ContentLength.HasValue)
            {
                return response.Content.Headers.ContentLength.Value / 1024.0; // Size in KB
            }
            throw new Exception("Unable to determine file size");
        }
    }

    public async Task<File> MarkFileAsFavoriteAsync(string userId, string fileId, bool favorite, string language)
    {
        try
        {
            _logger.Log(LogLevel.Information, $"MarkFileAsFavoriteAsync :: UserId [{userId}] - FileId [{fileId}]");
            
            var file = await _context.Files
                .FirstOrDefaultAsync(x => x.Id == Guid.Parse(fileId));

            if (file.Owner != userId)
            {
                _logger.Log(LogLevel.Error, $"MarkFileAsFavoriteAsync :: User [{userId}] does not own file [{fileId}]");
                throw new Exception("user_does_not_own_folder");
            }
            
            file.IsFavorited = favorite;
            _context.Files.Update(file);
            await _context.SaveChangesAsync();
            return file;
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"MarkFileAsFavoriteAsync :: {e.Message}");
            throw;
        }
    }
    
    public async Task<Folder> MarkFolderAsFavoriteAsync(string userId, int folderId, bool favorite, string language)
    {
        try
        {
            _logger.Log(LogLevel.Information, $"MarkFolderAsFavoriteAsync :: UserId [{userId}] - FileId [{folderId}]");
            
            var folder = await _context.Folders
                .FirstOrDefaultAsync(x => x.Id == folderId);

            if (folder.Owner != userId)
            {
                _logger.Log(LogLevel.Error, $"MarkFolderAsFavoriteAsync :: User [{userId}] does not own folder [{folderId}]");
                throw new Exception("user_does_not_own_folder");
            }
            
            folder.IsFavorited = favorite;
            _context.Folders.Update(folder);
            await _context.SaveChangesAsync();
            return folder;
        }
        catch (Exception e)
        {
            _logger.Log(LogLevel.Error, $"MarkFolderAsFavoriteAsync :: {e.Message}");
            throw;
        }
    }

    
    
    private dynamic GetDynamicObject(EmailObjectDto emailObject)
    {
        dynamic model = new ExpandoObject();
        model.userName = emailObject.UserName;
        model.fileUrl = emailObject.FileUrl;
        model.destinationEmail = emailObject.Email;
        return model;
    }
    
}

public class EmailObjectDto
{
    public string UserName { get; set; }
    public string FileUrl { get; set; }
    public string Email { get; set; }
    public string Language { get; set; }
}