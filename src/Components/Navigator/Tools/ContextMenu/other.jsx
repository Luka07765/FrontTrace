import React, { useRef } from 'react';
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
  const { contextMenuVisible, contextMenuPosition, setContextMenuVisible } = RightClick();
  const { selectedFolderId } = Select();
  const { handleCreateFile, handleUpdateFile, handleDeleteFile } = useFileListLogic();
  const { editFileId } = useFileStore();

  // Fiksirane dimenzije menija
  const MENU_WIDTH = 200;   // px, možeš prilagoditi
  const MENU_HEIGHT = selectedFolderId ? 240 : 120; // zavisi koliko stavki ima meni

  if (!contextMenuVisible) return null;

  // Izračunavanje pozicije menija
  let x = contextMenuPosition.x;
  let y = contextMenuPosition.y;

  if (x + MENU_WIDTH > window.innerWidth) {
    x = window.innerWidth - MENU_WIDTH - 10;
  }
  if (y + MENU_HEIGHT > window.innerHeight) {
    y = window.innerHeight - MENU_HEIGHT - 10;
  }

  const handleCreateFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: '',
        folderId,
        colors: '',
      });
    }
  };

  const handleMoveFile = async () => {
    if (!editFileId) {
      alert('No file selected to move');
      return;
    }

    const newFolderId = prompt('Enter destination folder ID:');
    if (newFolderId && newFolderId.trim() !== '') {
      try {
        await handleUpdateFile({
          id: editFileId,
          folderId: newFolderId.trim(),
        });
      } catch (err) {
        console.error('Error moving file:', err);
        alert('Failed to move file');
      }
    }
  };

  const handleRenameClick = () => {
    const folderToEdit = folders.find((f) => f.id === selectedFolderId);
    if (folderToEdit) {
      setFolderName(folderToEdit.title);
      setEditingFolderId(selectedFolderId);
      setContextMenuVisible(false);
    }
  };

  const handleCreateClick = () => {
    setCreatingFolderParentId(selectedFolderId ?? null);
    setContextMenuVisible(false);
  };

  return (
    <ul
      className="absolute bg-black text-white border rounded shadow-md z-50"
      style={{
        top: y,
        left: x,
        position: 'fixed',
        width: MENU_WIDTH,
      }}
      onClick={() => setContextMenuVisible(false)}
    >
      {selectedFolderId === null ? (
        <li
          className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
          onClick={handleCreateClick}
        >
          Create Folder
        </li>
      ) : (
        <>
          <li
            className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
            onClick={handleCreateClick}
          >
            Create Folder
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
            onClick={handleRenameClick}
          >
            Rename Folder
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
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
            className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
            onClick={() => handleCreateFileForFolder(selectedFolderId)}
          >
            Create File
          </li>
        </>
      )}

      <li
        className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
        onClick={() => {
          const confirmDelete = window.confirm('Are you sure you want to delete this file?');
          if (confirmDelete) {
            handleDeleteFile(editFileId);
          }
        }}
      >
        Delete File
      </li>

      <li
        className="px-4 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
        onClick={handleMoveFile}
      >
        Move File
      </li>
    </ul>
  );
};

export default ContextMenu;
