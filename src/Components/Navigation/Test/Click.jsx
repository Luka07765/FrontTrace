import React from 'react';
import { Click } from '@/Zustang/ClickLogic';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
export const ContextMenu = ({ onCreate }) => {
  const {
    handleDeleteFolder,

    folders,
  } = useFolderListLogic();
  const {
    contextMenuVisible,
    contextMenuPosition,
    setContextMenuVisible,
    handleDelete,
    setFolderName,
    handleRename,
    handleCreate,
  } = Click();

  //Optimizacija sranje veliko neka ga...
  if (!contextMenuVisible) return null;

  const onRename = () => {
    handleRename(folders, setFolderName); // Pass folders and setFolderName as arguments
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
        onClick={handleCreate}
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
