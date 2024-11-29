import React, { useState, useEffect } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { FolderModal } from './Test/Prompt';
import { ContextMenu } from './Test/Click';
import { buildNestedStructure } from './utilfolder'; // Import utility
import FolderTree from './redner'; // Import FolderTree component
import { Click } from '@/Zustang/ClickLogic';

export default function FolderList() {
  const {
    folders,
    loading,
    error,
    handleCreateFolder,
    handleDeleteFolder,
    handleUpdateFolder,
  } = useFolderListLogic();
  const {
    contextMenuVisible,
    setContextMenuVisible,
    contextMenuPosition,
    setContextMenuPosition,
    selectedFolderId,
    setSelectedFolderId,
  } = Click();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [folderName, setFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});

  const resetModalState = () => {
    setModalVisible(false);
    setFolderName('');
    setParentFolderId(null);
    setIsEditMode(false);
    setSelectedFolderId(null);
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
      setParentFolderId(folderToEdit.parentFolderId);
      setModalTitle('Edit Folder');
      setIsEditMode(true);
      setModalVisible(true);
    }
    setContextMenuVisible(false);
  };

  const handleDelete = () => {
    handleDeleteFolder(selectedFolderId);
    setContextMenuVisible(false);
    setSelectedFolderId(null);
  };

  const handleSubmit = () => {
    if (isEditMode) {
      handleUpdateFolder({
        id: selectedFolderId,
        title: folderName,
        parentFolderId: parentFolderId,
      });
    } else {
      handleCreateFolder({
        title: folderName,
        parentFolderId: selectedFolderId, // Create under selected folder
      });
    }
    resetModalState();
  };

  useEffect(() => {
    if (folders && folders.length > 0) {
      const nestedFolders = buildNestedStructure(folders);
      console.log(
        'Nested Folder Structure (JSON):',
        JSON.stringify(nestedFolders, null, 2)
      );
    }
  }, [folders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading folders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading folders: {error.message}</p>
      </div>
    );
  }

  const nestedFolders =
    folders && folders.length > 0 ? buildNestedStructure(folders) : [];

  return (
    <div
      className="relative w-64 bg-gray-800 text-white h-screen p-4 overflow-auto"
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
      }}
    >
      {nestedFolders.length > 0 ? (
        <FolderTree
          folders={nestedFolders}
          expandedFolders={expandedFolders}
          setExpandedFolders={setExpandedFolders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
          setContextMenuVisible={setContextMenuVisible}
          setContextMenuPosition={setContextMenuPosition}
        />
      ) : (
        <p className="text-gray-500">No folders to display.</p>
      )}

      {/* Context Menu */}
      {contextMenuVisible && (
        <ContextMenu
          isVisible={contextMenuVisible}
          position={contextMenuPosition}
          onCreate={handleCreate}
          onRename={handleRename}
          onDelete={handleDelete}
          onClose={() => setContextMenuVisible(false)}
        />
      )}

      {/* Folder Modal */}
      {modalVisible && (
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
      )}
    </div>
  );
}
