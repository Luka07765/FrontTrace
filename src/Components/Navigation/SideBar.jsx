import React, { useState, useEffect } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { FolderModal } from './Test/Prompt';
import { ContextMenu } from './Test/Click';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa'; // Import icons
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
    setContextMenuPosition,
    selectedFolderId,
    setSelectedFolderId,
    parentFolderId,
    setParentFolderId,
    modalVisible,
    setModalVisible,
    modalTitle,
    setModalTitle,
    isEditMode,
    setIsEditMode,
    handleCreate,
    handleDelete,
    handleRename,
    folderName,
    setFolderName,
    resetModalState,
    handleSubmit,
  } = Click();

  const [expandedFolders, setExpandedFolders] = useState({});

  function buildNestedStructure(folders) {
    const folderMap = {};

    folders.forEach((folder) => {
      folderMap[folder.id] = { ...folder, children: [] };
    });

    const nested = [];
    folders.forEach((folder) => {
      const parentFolderId =
        folder.parentFolderId === 'None' || folder.parentFolderId === null
          ? null
          : folder.parentFolderId;

      if (parentFolderId === null) {
        nested.push(folderMap[folder.id]);
      } else if (folderMap[parentFolderId]) {
        folderMap[parentFolderId].children.push(folderMap[folder.id]);
      }
    });

    return nested;
  }

  // Updated renderFolders function with expandable/collapsible functionality
  function renderFolders(folders) {
    return (
      <ul>
        {folders.map((folder) => {
          const isExpanded = expandedFolders[folder.id];
          const hasChildren = folder.children.length > 0;

          return (
            <li key={folder.id}>
              <div
                className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-600 ${
                  selectedFolderId === folder.id
                    ? 'border-2 border-blue-500'
                    : ''
                }`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedFolderId(folder.id);
                  setContextMenuVisible(true);
                  setContextMenuPosition({ x: e.pageX, y: e.pageY });
                }}
              >
                {/* Expand/Collapse Icon */}
                {hasChildren ? (
                  <span
                    onClick={() =>
                      setExpandedFolders((prev) => ({
                        ...prev,
                        [folder.id]: !isExpanded,
                      }))
                    }
                    className="mr-1"
                  >
                    {isExpanded ? (
                      <FaChevronDown className="inline" />
                    ) : (
                      <FaChevronRight className="inline" />
                    )}
                  </span>
                ) : (
                  <span className="mr-4" /> // Empty space for alignment
                )}

                {/* Folder Title */}
                <div
                  onClick={() =>
                    setSelectedFolderId(
                      selectedFolderId === folder.id ? null : folder.id
                    )
                  }
                  className="flex-grow"
                >
                  <strong>{folder.title + ' '}</strong>
                  <strong>{' ID: ' + folder.id}</strong>
                  <strong>{'  FOLDER ' + folder.parentFolderId}</strong>
                </div>
              </div>

              {/* Render children recursively if expanded */}
              {hasChildren && isExpanded && (
                <div className="ml-4">{renderFolders(folder.children)}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  const onRename = () => {
    handleRename(folders, setFolderName); // Pass folders and setFolderName as arguments
  };

  const onDelete = () => {
    handleDelete(handleDeleteFolder);
  };

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
        renderFolders(nestedFolders)
      ) : (
        <p className="text-gray-500">No folders to display.</p>
      )}

      {contextMenuVisible && (
        <ContextMenu
          onCreate={handleCreate}
          onRename={onRename}
          onDelete={onDelete}
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
          onSubmit={() => handleSubmit(handleCreateFolder, handleUpdateFolder)}
          onCancel={resetModalState}
          showParentInput={isEditMode}
        />
      )}
    </div>
  );
}
