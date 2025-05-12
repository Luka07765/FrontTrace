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
    const { title, content, folderId,colors } = fileData;
    

    if (!folderId || !title) {
      alert('Folder ID and File Name are required.');
      return;
    }

    try {
      await createFile({
        variables: {
          input: { title, content, folderId ,colors},
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
    const { id, title, content, folderId,colors } = fileData;

    if (!id) {
      alert('File ID is required.');
      return;
    }

    const fileId = id;
    const input = {};
    if (title !== undefined) input.title = title;
    if (content !== undefined) input.content = content;
    if (folderId !== undefined) input.folderId = folderId;
    if (colors  !== undefined) input.colors   = colors;

    try {
      await updateFile({
        variables: {
          id: fileId.toString(),
          input, 
        },
      });
      refetch();
    } catch (err) {
      console.error('Error updating file:', err.message);
      alert(fileId);
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
