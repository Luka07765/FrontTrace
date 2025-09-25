import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/GraphQl/Operations/Logic/Folder_Logic';
import { useFileListLogic } from '@/Server/GraphQl/Operations/Logic/File_Logic';

import { useFileStore } from '@/Zustand/File_Store';
import { ContextClick } from '@/Zustand/Context_Store';

export const useContextMenuActions = () => {
  const { handleDeleteFolder, folders } = useFolderListLogic();
  const {
    handleDelete,
    setEditingFolderId,
    setCreatingFolderParentId,
    setFolderName,
  } = useFolderStore();

  const { handleCreateFile, handleUpdateFile, handleDeleteFile } = useFileListLogic();
  const { fileId } = useFileStore();
  const { setContextMenuVisible ,iconSelected,selectedFolderId} = ContextClick();

  const createFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: '',
        folderId,
        colors: '',
        filePosition: 0,
        iconId:1
      });
    }
  };

 const newIcon = async () => {
    await handleUpdateFile({
      id: file.id,
      iconId: iconSelected, 
    });

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
      handleDeleteFile(fileId);
    }
  };

  return {
    selectedFolderId,
    renameFolder,
    createFolder,
    deleteFolder,
    createFileForFolder,
    deleteFile,
    newIcon

  };
};
