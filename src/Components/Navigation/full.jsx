import React, { useState, useEffect } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { FolderModal } from './Test/Prompt';
import { ContextMenu } from './Test/Click';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa'; // Import icons

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

  // State to track expanded folders
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
      <ul className="space-y-1">
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
                    setSelectedFolderId((prev) =>
                      prev === folder.id ? null : folder.id
                    )
                  }
                  className="flex-grow"
                >
                  <strong>{folder.title}</strong>
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

  // Build the nested folder structure
  const nestedFolders =
    folders && folders.length > 0 ? buildNestedStructure(folders) : [];

  return (
    <div
      className="relative w-64 bg-gray-800 text-white h-screen p-4 overflow-auto"
      onClick={() => {
        setContextMenuVisible(false);
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
