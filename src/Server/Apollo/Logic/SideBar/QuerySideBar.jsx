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
    const { title, parentFolderId,iconId } = folderData;

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
      iconId: iconId,
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
             iconId: createFolder.iconId,
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
    const { id, title, parentFolderId,iconId  } = folderData;

      if (!id) {
    alert('Folder ID is required.');
    return;
  }

  const input = {};
  if (title !== undefined) input.title = title;
  if (parentFolderId !== undefined) input.parentFolderId = parentFolderId !== '' ? parentFolderId : null;
  if (iconId !== undefined) input.iconId = iconId; 


    try {
    await updateFolder({
  variables: {
    id: id.toString(),
    input,
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
        iconId: updateFolder.iconId ?? folder.iconId, 
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
