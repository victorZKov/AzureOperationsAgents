using AzureOperationsAgents.Core.Models.Files;
using File = AzureOperationsAgents.Core.Models.Files.File;

namespace AzureOperationsAgents.Core.Interfaces.Files;

public interface IFilesService
{
   Task<List<Folder>> GetFoldersAsync(string userId, int root);
       Task<Folder> GetFolderAsync(string userId, int folderId);
       Task DeleteFolderAsync(string userid, int folderId);
       Task<List<File>> GetFilesAsync(string userId, int root);
       Task CreateFolderAsync(string userId, string name, int parentFolderId);
       Task<File> CreateFileAsync(string userId, FileDto fileDto);
       Task<File> MarkFileAsFavoriteAsync(string userId, string fileId, bool favorite, string language);
       Task<Folder> MarkFolderAsFavoriteAsync(string userId, int folderId, bool favorite, string language); 
}