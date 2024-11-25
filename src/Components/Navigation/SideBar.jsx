import React, { useState, useRef } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { FolderModal } from './Test/Prompt';
import { ContextMenu } from './Test/Click';
export default function FolderList() {
  const {
    folders,
    loading,
    error,
    handleCreateFolder,
    handleDeleteFolder,
    handleUpdateFolder,
  } = useFolderListLogic();

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [folderName, setFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const resetModalState = () => {
    setModalVisible(false);
    setFolderName('');
    setParentFolderId('');
    setIsEditMode(false);
  };

  const handleCreate = () => {
    setModalTitle('Create Folder');
    setIsEditMode(false);
    setModalVisible(true);
    setContextMenuVisible(false);
  };

  const handleRename = () => {
    const folderToEdit = folders.find((f) => f.id === selectedFolderId);
    if (folderToEdit) {
      setFolderName(folderToEdit.title);
      setParentFolderId(
        folderToEdit.parentFolderId
          ? folderToEdit.parentFolderId.toString()
          : ''
      );
      setModalTitle('Edit Folder');
      setIsEditMode(true);
      setModalVisible(true);
    }
    setContextMenuVisible(false);
  };

  const handleDelete = () => {
    handleDeleteFolder(selectedFolderId);
    setContextMenuVisible(false);
  };

  const handleSubmit = () => {
    if (isEditMode) {
      handleUpdateFolder({
        id: selectedFolderId,
        title: folderName,
        parentFolderId: parentFolderId ? parseInt(parentFolderId, 10) : null,
      });
    } else {
      handleCreateFolder({
        title: folderName,
        parentFolderId: selectedFolderId,
      });
    }
    resetModalState();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading folders...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading folders: {error.message}</p>
      </div>
    );

  return (
    <div
      className="relative w-64 bg-gray-800 text-white h-screen p-4"
      onClick={() => setContextMenuVisible(false)}
    >
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li
            key={folder.id}
            onClick={() => setSelectedFolderId(folder.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setSelectedFolderId(folder.id);
              setContextMenuVisible(true);
              setContextMenuPosition({ x: e.pageX, y: e.pageY });
            }}
            className={`p-2 rounded cursor-pointer hover:bg-gray-600 ${
              selectedFolderId === folder.id ? 'border-2 border-blue-500' : ''
            }`}
          >
            <strong>{folder.title}</strong>
            <span className="text-sm text-gray-300 ml-2">
              (ID: {folder.id} + Parant +{folder.parentFolderId})
            </span>
            <span className="text-sm text-gray-300 ml-2">(ID:)</span>
          </li>
        ))}
      </ul>

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenuVisible}
        position={contextMenuPosition}
        onCreate={handleCreate}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      {/* Folder Modal */}
      <FolderModal
        isVisible={modalVisible}
        title={modalTitle}
        folderName={folderName}
        setFolderName={setFolderName}
        parentFolderId={parentFolderId}
        setParentFolderId={setParentFolderId}
        onSubmit={handleSubmit}
        onCancel={resetModalState}
        showParentInput={isEditMode}
      />
    </div>
  );
}
