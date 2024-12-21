import React from 'react';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Select } from '@/Zustand/Select_Store';
import { useFileStore } from '@/Zustand/File_Store';
export const ContextMenu = () => {
  const { handleDeleteFolder, folders } = useFolderListLogic();
  const {
    contextMenuVisible,
    contextMenuPosition,
    setContextMenuVisible,
    handleDelete,

    setEditingFolderId,
    setCreatingFolderParentId,

    setFolderName,
  } = useFolderStore();
  const { selectedFolderId } = Select();
  const { handleCreateFile } = useFileListLogic();
  const { editFileId } = useFileStore();
  const { handleDeleteFile } = useFileListLogic();

  const handleCreateFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: 'New File Content',
        folderId,
      });
    }
  };

  //Optimizacija sranje veliko neka ga...
  if (!contextMenuVisible) return null;

  const handleRenameClick = () => {
    const folderToEdit = folders.find((f) => f.id === selectedFolderId);

    if (folderToEdit) {
      setFolderName(folderToEdit.title);

      setEditingFolderId(selectedFolderId);

      setContextMenuVisible(false);
    }
  };
  const handleCreateClick = () => {
    if (selectedFolderId) {
      setCreatingFolderParentId(selectedFolderId);
    } else {
      setCreatingFolderParentId(null);
    }
    setContextMenuVisible(false);
  };

  return (
    <ul
      className="absolute bg-black border rounded shadow-md z-50"
      style={{
        top: contextMenuPosition.y,
        left: contextMenuPosition.x,
        position: 'fixed',
      }}
      onClick={() => setContextMenuVisible(false)} // Optional: hide menu on click
    >
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={handleCreateClick}
      >
        Create Folder
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={handleRenameClick}
      >
        Rename Folder
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => handleDelete(handleDeleteFolder, selectedFolderId)}
      >
        Delete Folder
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          handleCreateFileForFolder(selectedFolderId);
        }}
      >
        Create File
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => handleDeleteFile(editFileId)}
      >
        Delete File
      </li>
    </ul>
  );
};

export default ContextMenu;
