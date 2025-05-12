import { useQuery, useMutation } from '@apollo/client';
import {
  GET_FOLDERS,
  CREATE_FOLDER,
  DELETE_FOLDER,
  UPDATE_FOLDER,
  GET_FILES,
  CREATE_FILE,
  DELETE_FILE,
  UPDATE_FILE,
} from '../Queries/FolderFileQueries';

// Fetch folders
export const useFetchFolders = () => {
  const { data, loading, error, refetch } = useQuery(GET_FOLDERS);

  // Transform data if necessary
  const folders = data?.getFolders.map((folder) => ({
    ...folder,
    parentFolderId: folder.parentFolderId ?? 'None', // Default parentFolderId to "None" if null
  }));

  return { folders, loading, error, refetch };
};



// Create folder
export const useCreateFolder = () => {
  return useMutation(CREATE_FOLDER);
};

// Delete folder
export const useDeleteFolder = () => {
  return useMutation(DELETE_FOLDER);
};

// Update folder
export const useUpdateFolder = () => {
  return useMutation(UPDATE_FOLDER);
};

//Files
export const useFetchFiles = () => {
  const { data, loading, error, refetch } = useQuery(GET_FILES);

  // Transform data if necessary
  const files = data?.getFiles.map((file) => ({
    ...file,
    content: file.content ?? '', // Default to empty content if null
  }));

  return { files, loading, error, refetch };
};

// Create file
export const useCreateFile = () => {
  return useMutation(CREATE_FILE);
};

// Delete file
export const useDeleteFile = () => {
  return useMutation(DELETE_FILE);
};

// Update file
export const useUpdateFile = () => {
  return useMutation(UPDATE_FILE);
};
