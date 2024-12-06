import React from 'react';
import { Click } from '@/Zustand/Click_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
export const ContextMenu = () => {
  const { handleDeleteFolder, handleDeleteFile } = useFolderListLogic();
  const {
    contextMenuVisible,
    contextMenuPosition,
    setContextMenuVisible,
    handleDelete,
    selectedFolderId,
    setEditingFolderId,
    setCreatingFolderParentId,

    setFolderName,
  } = Click();

  //Optimizacija sranje veliko neka ga...
  if (!contextMenuVisible) return null;

  const handleRenameClick = () => {
    setFolderName(''); // Optional: set to current folder name
    setEditingFolderId(selectedFolderId);
    setContextMenuVisible(false);
  };

  const handleCreateClick = () => {
    setFolderName('');
    if (selectedFolderId) {
      setCreatingFolderParentId(selectedFolderId);
    } else {
      setCreatingFolderParentId(null);
    }
    setContextMenuVisible(false);
  };

  const onDelete = () => {
    handleDelete(handleDeleteFolder);
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
        onClick={onDelete}
      >
        Delete Folder
      </li>
    </ul>
  );
};

export default ContextMenu;
