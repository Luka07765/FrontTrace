import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Select } from '@/Zustand/Select_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { RightClick } from '@/Zustand/Context_Store';

export const useContextMenuActions = () => {
  const { handleDeleteFolder, folders } = useFolderListLogic();
  const {
    handleDelete,
    setEditingFolderId,
    setCreatingFolderParentId,
    setFolderName,
  } = useFolderStore();
  const { selectedFolderId } = Select();
  const { handleCreateFile, handleUpdateFile, handleDeleteFile } = useFileListLogic();
  const { editFileId } = useFileStore();
  const { setContextMenuVisible } = RightClick();

  const createFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: '',
        folderId,
        colors: '',
        filePosition: 0,
      });
    }
  };


  const renameFolder = () => {
    const folderToEdit = folders.find((f) => f.id === selectedFolderId);
    if (folderToEdit) {
      setFolderName(folderToEdit.title);
      setEditingFolderId(selectedFolderId);
      setContextMenuVisible(false);
    }
  };

  const createFolder = () => {
    setCreatingFolderParentId(selectedFolderId ?? null);
    setContextMenuVisible(false);
  };

const deleteFolder = () => {
  const folderToDelete = folders.find((f) => f.id === selectedFolderId);

  if (!folderToDelete) return;

  if (window.confirm(`Delete folder "${folderToDelete.title}"?`)) {
    handleDelete(handleDeleteFolder, selectedFolderId);
  }
};


  const deleteFile = () => {
    if (window.confirm('Delete this file?')) {
      handleDeleteFile(editFileId);
    }
  };

  return {
    selectedFolderId,
    renameFolder,
    createFolder,
    deleteFolder,
    createFileForFolder,
    deleteFile,

  };
};
