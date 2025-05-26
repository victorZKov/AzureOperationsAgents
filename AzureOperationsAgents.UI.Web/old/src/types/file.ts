// ----------------------------------------------------------------------
export type IFolder = {
  Id: string;
  Owner: string;
  Name: string;
  ParentId: number;
  children: string[];
  IsFavorited: boolean;
  CreatedAt: Date | number | string;
  ModifiedAt: Date | number | string;
  Size: number;
  Url: string;
}


export type IFileFilterValue = string | string[] | Date | null;

export type IFileFilters = {
  name: string;
  type: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IFileDto = {
  Name: string;
  ParentId: number;
  Url: string;
  Size: number;
  Description: string;
}
// ----------------------------------------------------------------------

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type IFolderManager = {
  Id: string;
  Name: string;
  Size: number;
  Type: string;
  Url: string;
  Tags: string[];
  TotalFiles?: number;
  IsFavorited: boolean;
  Shared: IFileShared[] | null;
  CreatedAt: Date | number | string;
  ModifiedAt: Date | number | string;
    Description: string;
};

export type IFileManager = {
  Id: string;
  Name: string;
  Owner: string;
  FolderId: number;
  Size: number;
  Type: string;
  Url: string;
  Tags: string[];
  IsFavorited: boolean;
  Shared: IFileShared[] | null;
  CreatedAt: Date | number | string;
  ModifiedAt: Date | number | string;
  Description: string;
};

export type IFile = IFileManager | IFolderManager;

export const FILE_TYPE_OPTIONS = [
  'folder',
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
  'photoshop',
  'illustrator',
];