import { useQuery, useMutation } from '@apollo/client';
import {
  GET_FOLDERS,
  GET_FILES,
  GET_FILE_BY_ID,   GET_TAGS,
  GET_TAG_BY_ID,GET_FILES_BY_TAG
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


export const useFetchFileById = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_FILE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    file: data?.getFileById || null,
    loading,
    error,
    refetch,
  };
};

export const useFetchTags = () => {
  const { data, loading, error, refetch } = useQuery(GET_TAGS);

  const tags = data?.getTags ?? []; // matches backend schema

  return { tags, loading, error, refetch };
};


// Fetch a single tag by ID
export const useFetchTagById = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_TAG_BY_ID, {
    variables: { id },
  });

  return { tag: data?.getTagById, loading, error, refetch };
};

export const useFetchFilesByTag = (tagId) => {
  const { data, loading, error, refetch } = useQuery(GET_FILES_BY_TAG, {
    variables: { tagId },
    skip: !tagId,
  });

  const files = data?.getFilesByTag ?? [];

  return { files, loading, error, refetch };
};