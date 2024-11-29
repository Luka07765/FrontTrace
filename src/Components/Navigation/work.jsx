import React, { useState, useEffect } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { FolderModal } from './Test/Prompt';
import { ContextMenu } from './Test/Click';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
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
  const [parentFolderId, setParentFolderId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({}); // novo

  function buildNestedStructure(folders) {
    const folderMap = {};

    folders.forEach((folder) => {
      folderMap[folder.id] = { ...folder, children: [] };
    });

    const nested = [];
    folders.forEach((folder) => {
      const parentFolderId =
        folder.parentFolderId === 'None' ? null : folder.parentFolderId;

      if (parentFolderId === null) {
        nested.push(folderMap[folder.id]);
      } else if (folderMap[parentFolderId]) {
        folderMap[parentFolderId].children.push(folderMap[folder.id]);
      }
    });

    return nested;
  }

  // Updated renderFolders function with proper event handlers
  function renderFolders(folders) {
    return (
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li key={folder.id}>
            <div
              onClick={() =>
                setSelectedFolderId((prev) =>
                  prev === folder.id ? null : folder.id
                )
              }
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
                (ID: {folder.id} Parent: {folder.parentFolderId})
              </span>
            </div>
            {/* Render children recursively */}
            {folder.children.length > 0 && (
              <div className="ml-4">{renderFolders(folder.children)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  }

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
        parentFolderId: selectedFolderId, // Set as the parent ID if creating under selected folder
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

  // Build the nested folder structure
  const nestedFolders =
    folders && folders.length > 0 ? buildNestedStructure(folders) : [];

  return (
    <div
      className="relative w-64 bg-gray-800 text-white h-screen p-4"
      onClick={() => {
        setContextMenuVisible(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
      }}
    >
      {nestedFolders.length > 0 ? (
        renderFolders(nestedFolders)
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
