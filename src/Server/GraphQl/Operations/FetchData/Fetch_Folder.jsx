import { useQuery, useMutation } from '@apollo/client';
import {
  GET_FOLDERS,

} from '../../Query/Queries/Folder';


export const useFetchFolders = () => {
  const { data, loading, error, refetch } = useQuery(GET_FOLDERS);

  // Transform data if necessary
  const folders = data?.getFolders.map((folder) => ({
    ...folder,
    parentFolderId: folder.parentFolderId ?? 'None', // Default parentFolderId to "None" if null
  }));

  return { folders, loading, error, refetch };
};
