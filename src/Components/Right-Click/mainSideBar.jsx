import React from 'react';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
export const ContextMenu = () => {
  const { handleDeleteFolder, folders } = useFolderListLogic();
  const {
    contextMenuVisible,
    contextMenuPosition,
    setContextMenuVisible,
    handleDelete,
    selectedFolderId,
    setEditingFolderId,
    setCreatingFolderParentId,

    setFolderName,
  } = useFolderStore();
  const { handleDeleteFile } = useFileListLogic();
  //Optimizacija sranje veliko neka ga...
  if (!contextMenuVisible) return null;

  const handleRenameClick = () => {
    // Get the selected folder
    const folderToEdit = folders.find((f) => f.id === selectedFolderId);

    if (folderToEdit) {
      // Set the folder's current title as the folderName
      setFolderName(folderToEdit.title);
      // Now set editingFolderId
      setEditingFolderId(selectedFolderId);
      // Close the context menu
      setContextMenuVisible(false);
    }
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

  const onDeleteFolder = () => {
    handleDelete(handleDeleteFolder);
  };

  const onDeleteFile = () => {
    handleDeleteFile(file.id);
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
        onClick={onDeleteFolder}
      >
        Delete Folder
      </li>
    </ul>
  );
};

export default ContextMenu;
