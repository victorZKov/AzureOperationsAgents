import useSWR from 'swr';
import {useCallback, useMemo} from 'react';
// utils
import {fetcher, endpoints, api} from 'src/utils/axios';
// types
import {IFile, IFileDto} from 'src/types/file';
import { IFolder } from 'src/types/file';

// ----------------------------------------------------------------------

export function useGetFolders(parentFolderId?: string) {
    const URL = parentFolderId ? `${endpoints.folder.list}?parentFolderId=${parentFolderId}` : endpoints.folder.list;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            folders: (data?.Value as IFolder[]) || [],
            foldersLoading: isLoading,
            foldersError: error,
            foldersValidating: isValidating,
            foldersEmpty: !isLoading && !(data?.Value?.length),
        }),
        [data?.Value, error, isLoading, isValidating]
    );

    return memoizedValue;
}
export function useGetStorage() {
    const URL = endpoints.folder.storage;
    const {data, isLoading, error, isValidating} = useSWR(URL, fetcher);
    
    const memoizedValue = useMemo(
        () => ({
        storage: data?.storage as number,
        storageLoading: isLoading,
        storageError: error,
        storageValidating: isValidating,
        }),
        [data?.storage, error, isLoading, isValidating]
    );
    
    return memoizedValue;
    }

// ----------------------------------------------------------------------

// export function useGetFolder(folderId: string) {
//   const URL = folderId ? [endpoints.folder.details, { params: { folderId } }] : null;
//
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//
//   const memoizedValue = useMemo(
//     () => ({
//       folder: data?.folder as IFolder,
//       folderLoading: isLoading,
//       folderError: error,
//       folderValidating: isValidating,
//     }),
//     [data?.folder, error, isLoading, isValidating]
//   );
//
//   return memoizedValue;
// }

export function useGetFiles(parentFolderId?: string) {  
    const URL = parentFolderId ? `${endpoints.file.list}?parentFolderId=${parentFolderId}` : endpoints.file.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            filesFromDb: (data?.Value as IFile[]) || [],
            filesLoading: isLoading,
            filesError: error,
            filesValidating: isValidating,
            filesEmpty: !isLoading && !(data?.Value?.length),
        }),
        [data?.Value, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetFile(fileId: string) {
//   const URL = fileId ? [endpoints.file.details, { params: { fileId } }] : null;
//
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//
//   const memoizedValue = useMemo(
//     () => ({
//       file: data?.file as IFile,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.file, error, isLoading, isValidating]
//   );
//
//   return memoizedValue;
// }

// ----------------------------------------------------------------------

export function useSearchFiles(query: string) {
  const URL = query ? [endpoints.file.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IFile[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useCreateFolder() {
    const URL = endpoints.folder.new;

    const createFolder = useCallback(async (data: any) => {
        try {
            const response = await api.post(URL, data);
            return response.data;
        } catch (error) {
            console.error('Failed to create folder:', error);
            throw error;
        }
    }, [URL]);

    return createFolder;
}

export function useCreateFile() {
    const URL = endpoints.file.upload;

    const createFile = useCallback(async (data: any) => {
        try {
            const response = await api.post(URL, data);
            return response.data;
        } catch (error) {
            console.error('Failed to create file:', error);
            throw error;
        }
    }, [URL]);

    return createFile;
}

export function useMarkFileAsFavorite() {


    const markAsFavorite = useCallback(async (fileId: string) => {
        try {
            const URL = `${endpoints.file.favorite}/${fileId}`;
            const response = await api.post(URL, { fileId });
            return response.data;
        } catch (error) {
            console.error('Failed to mark as favorite:', error);
            throw error;
        }
    }, [URL]);

    return markAsFavorite;
}

export function useMarkFileAsNotFavorite() {
    

    const markAsNotFavorite = useCallback(async (fileId: string) => {
        try {
            const URL = `${endpoints.file.notfavorite}/${fileId}`;
            const response = await api.post(URL, { fileId });
            return response.data;
        } catch (error) {
            console.error('Failed to mark as not favorite:', error);
            throw error;
        }
    }, [URL]);

    return markAsNotFavorite;
}

export function useMarkFolderAsFavorite() {
    

    const markAsFavorite = useCallback(async (folderId: string) => {
        try {
            const URL = `${endpoints.folder.favorite}/${folderId}`;
            const response = await api.post(URL);
            return response.data;
        } catch (error) {
            console.error('Failed to mark as favorite:', error);
            throw error;
        }
    }, [URL]);

    return markAsFavorite;
}

export function useMarkFolderAsNotFavorite() {
    
    const markAsNotFavorite = useCallback(async (folderId: string) => {
        try {
            const URL = `${endpoints.folder.notfavorite}/${folderId}`;
            const response = await api.post(URL);
            return response.data;
        } catch (error) {
            console.error('Failed to mark as not favorite:', error);
            throw error;
        }
    }, [URL]);

    return markAsNotFavorite;
}

export function useSendLink() {
    const URL = endpoints.file.sendLink;
    const sendLink = useCallback(async (data: any) => {
        console.log('URL', URL);
        try {
            console.log('api', api);
            const response = await api.post(URL, data);
            console.log('response', response);
            return response.data;
        } catch (error) {
            console.error('Failed to send link:', error);
            throw error;
        }
    }, [URL]);

    return sendLink;
}