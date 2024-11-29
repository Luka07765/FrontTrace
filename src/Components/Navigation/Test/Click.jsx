import React from 'react';
import { Click } from '@/Zustang/ClickLogic';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
export const ContextMenu = ({ onCreate, onRename }) => {
  const { handleCreateFolder, handleDeleteFolder, handleUpdateFolder } =
    useFolderListLogic();
  const {
    contextMenuVisible,
    contextMenuPosition,
    setContextMenuVisible,
    handleDelete,
  } = Click();

  if (!contextMenuVisible) return null;
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
        onClick={onCreate}
      >
        Create Folder
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={onRename}
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
