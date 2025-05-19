import {
  useFetchFolders,
  useCreateFolder,
  useDeleteFolder,
  useUpdateFolder,
} from '@/Server/Apollo/Query/FetchQuery/FetchFolderFile';
import { GET_FOLDERS } from '@/Server/Apollo/Query/Queries/FolderFileQueries';

export function useFolderListLogic() {
  const { folders, loading, error, refetch } = useFetchFolders();
  const [createFolder] = useCreateFolder();
  const [deleteFolder] = useDeleteFolder();
  const [updateFolder] = useUpdateFolder();

  const handleCreateFolder = async (folderData) => {
    const { title, parentFolderId } = folderData;

    if (!title) {
      alert('Folder Name is required.');
      return;
    }

    try {
      await createFolder({
  variables: {
    input: {
      title,
      parentFolderId: parentFolderId !== '' ? parentFolderId : null,
    },
  },
update: (cache, { data: { createFolder } }) => {
  const existingData = cache.readQuery({ query: GET_FOLDERS });

  if (existingData?.getFolders) {
    cache.writeQuery({
      query: GET_FOLDERS,
      data: {
        getFolders: [
          ...existingData.getFolders,
          {
            ...createFolder,
            files: [], 
            __typename: 'Folder',
          },
        ],
      },
    });
  }
}

});

   
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
 await deleteFolder({
  variables: { id: id.toString() },
  update: (cache) => {
    const existingData = cache.readQuery({ query: GET_FOLDERS });

 if (existingData?.getFolders) {
  cache.writeQuery({
    query: GET_FOLDERS,
    data: {
      getFolders: existingData.getFolders.filter((folder) => folder.id !== id),
    },
  });
}

  },
});

    } catch (err) {
      console.error('Error deleting folder:', err);
      alert('Failed to delete folder. Please try again.');
    }
  };

  const handleUpdateFolder = async (folderData) => {
    const { id, title, parentFolderId } = folderData;

    if (!id || !title) {
      alert('Folder ID and Folder Name are required.');
      return;
    }

    try {
    await updateFolder({
  variables: {
    id: id.toString(),
    input: {
      title,
      parentFolderId: parentFolderId !== '' ? parentFolderId : null,
    },
  },
  update: (cache, { data: { updateFolder } }) => {
    const existingData = cache.readQuery({ query: GET_FOLDERS });

 if (existingData?.getFolders) {
  cache.writeQuery({
    query: GET_FOLDERS,
    data: {
      getFolders: existingData.getFolders.map((folder) =>
  folder.id === id
    ? {
        ...updateFolder,
        files: folder.files ?? [],
        __typename: 'Folder',
      }
    : folder
),

    },
  });
}

  },
});

    } catch (err) {
      console.error('Error updating folder:', err);
      alert('Failed to update folder. Please try again.');
    }
  };

  return {
    folders,
    loading,
    error,
    handleCreateFolder,
    handleDeleteFolder,
    handleUpdateFolder,
  };
}
