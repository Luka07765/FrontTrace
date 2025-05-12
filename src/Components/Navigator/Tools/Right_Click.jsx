import React from 'react';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Select } from '@/Zustand/Select_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { RightClick } from '@/Zustand/Context_Store';
export const ContextMenu = () => {
  const { handleDeleteFolder, folders } = useFolderListLogic();
  const {
    handleDelete,
    setEditingFolderId,
    setCreatingFolderParentId,
    setFolderName,
  } = useFolderStore();
  const { contextMenuVisible, contextMenuPosition, setContextMenuVisible } =
    RightClick();
  const { selectedFolderId } = Select();
  const { handleCreateFile,handleUpdateFile } = useFileListLogic();
  const { editFileId } = useFileStore();
  const { handleDeleteFile } = useFileListLogic();

  const handleCreateFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: '',
        folderId,
        colors: ""
      });
    }
  };

 const handleMoveFile = async () => {
    if (!editFileId) {
      alert('No file selected to move');
      return;
    }

    // Show list of available folders to move to

    const newFolderId = prompt();
    
    if (newFolderId && newFolderId.trim() !== '') {
      try {
        await handleUpdateFile({
          id: editFileId,
          folderId: newFolderId.trim()
        });
  

      } catch (err) {
        console.error('Error moving file:', err);
        alert('Failed to move file');
      }
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
      {selectedFolderId === null ? (
        // If selectedFolderId is null, show only "Create Folder"
        <li
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          onClick={handleCreateClick}
        >
          Create Folder
        </li>
      ) : (
        // If selectedFolderId is not null, show "Create Folder," "Rename Folder," and "Delete Folder"
        <>
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
            onClick={() => {
              const confirmDelete = window.confirm('Are you sure you want to delete this folder?');
              if (confirmDelete) {
                handleDelete(handleDeleteFolder, selectedFolderId);
              }
            }}
            
            
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
        </>
      )}

      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          const confirmDelete = window.confirm('Are you sure you want to delete this file?');
          if (confirmDelete) {
            handleDeleteFile(editFileId);
          }
        }}
        
      >
        Delete File
      </li>      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={handleMoveFile}
      >
        Move File
      </li>
    </ul>
  );
};

export default ContextMenu;
