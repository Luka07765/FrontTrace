// hooks/useFileListLogic.js

import {
  useFetchFiles,
  useCreateFile,
  useDeleteFile,
  useUpdateFile,
} from '@/Server/Apollo/Query/FetchQuery/FetchFolderFile';

export function useFileListLogic() {
  const { files, loading, error, refetch } = useFetchFiles();
  const [createFile] = useCreateFile();
  const [deleteFile] = useDeleteFile();
  const [updateFile] = useUpdateFile();

  const handleCreateFile = async (fileData) => {
    const { title, content, folderId } = fileData;

    if (!folderId || !title) {
      alert('Folder ID and File Name are required.');
      return;
    }

    try {
      await createFile({
        variables: {
          input: { title, content, folderId },
        },
      });
      refetch();
    } catch (err) {
      console.error('Error creating file:', err);
      alert('Failed to create file. Please try again.');
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await deleteFile({ variables: { id } });
      refetch();
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleUpdateFile = async (fileData) => {
    const { id, title, content, folderId } = fileData;

    if (!id || !title) {
      alert('File ID and File Name are required.');
      return;
    }

    try {
      await updateFile({
        variables: {
          id: parseInt(id, 10),
          input: { title, content, folderId: folderId || null },
        },
      });
      refetch();
    } catch (err) {
      console.error('Error updating file:', err.message);
      alert('Failed to update file. Please try again.');
    }
  };

  return {
    files,
    loading,
    error,
    handleCreateFile,
    handleDeleteFile,
    handleUpdateFile,
  };
}
