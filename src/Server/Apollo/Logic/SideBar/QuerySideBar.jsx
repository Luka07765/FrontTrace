import {
  useFetchFolders,
  useCreateFolder,
  useDeleteFolder,
  useUpdateFolder,
} from '@/Server/Apollo/Query/FetchQuery/FetchFolderFile';

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
      });
      refetch();
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await deleteFolder({ variables: { id: parseInt(id, 10) } });
      refetch();
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
          id: parseInt(id, 10),
          input: {
            title,
            parentFolderId: parentFolderId !== '' ? parentFolderId : null,
          },
        },
      });
      refetch();
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
