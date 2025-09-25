import { useQuery } from '@apollo/client';
import {

  GET_FILES,
  GET_FILE_BY_ID,

} from '../../Query/Queries/File';

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
