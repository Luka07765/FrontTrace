import React, { useEffect } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Click } from '@/Zustand/Click_Store';
import { useFileListLogic } from '@/Server/Apollo/Query/FetchQuery/FetchFolderFile';

export const FolderTree = ({ folders }) => {
  const {
    expandedFolders,
    setExpandedFolders,
    selectedFolderId,
    setSelectedFolderId,
    setContextMenuVisible,
    setContextMenuPosition,
    editingFolderId,
    setEditingFolderId,
    creatingFolderParentId,
    setCreatingFolderParentId,
    folderName,
    setFolderName,
  } = Click();

  const {
    files,
    loading: filesLoading,
    error: filesError,
    handleCreateFile,
    handleDeleteFile,
    handleUpdateFile,
  } = useFileListLogic();

  const handleRename = (folderId) => {
    if (folderName.trim() !== '') {
      handleUpdateFolder({ id: folderId, title: folderName.trim() });
    }
    setEditingFolderId(null);
    setFolderName('');
  };

  const handleCreate = (parentFolderId) => {
    if (folderName.trim() !== '') {
      handleCreateFolder({ title: folderName.trim(), parentFolderId });
    }
    setCreatingFolderParentId(undefined);
    setFolderName('');
  };

  const handleExpandFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: 'New File Content',
        folderId,
      });
    }
  };

  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);

  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const hasChildren = folder.children && folder.children.length > 0;
        const isEditing = editingFolderId === folder.id;
        const isCreatingChild = creatingFolderParentId === folder.id;

        return (
          <li key={folder.id} className="relative">
            <div
              className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-600 ${
                selectedFolderId === folder.id ? 'border-2 border-blue-500' : ''
              }`}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedFolderId(folder.id);
                setContextMenuVisible(true);
                setContextMenuPosition({ x: e.pageX, y: e.pageY });
              }}
            >
              {/* Expand/Collapse Icon */}
              {hasChildren || folderFiles(folder.id).length > 0 ? (
                <span
                  onClick={() => handleExpandFolder(folder.id)}
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

              <div
                onClick={() =>
                  setSelectedFolderId(
                    selectedFolderId === folder.id ? null : folder.id
                  )
                }
                className="flex-grow"
              >
                {isEditing ? (
                  <input
                    className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={() => handleRename(folder.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRename(folder.id);
                      } else if (e.key === 'Escape') {
                        setEditingFolderId(null);
                        setFolderName('');
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <strong>{folder.title}</strong>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFileForFolder(folder.id);
                      }}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded"
                    >
                      + File
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Render files if folder is expanded */}
            {isExpanded && folderFiles(folder.id).length > 0 && (
              <ul className="ml-4">
                {folderFiles(folder.id).map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between"
                  >
                    <span>{file.title}</span>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Render children recursively if expanded */}
            {hasChildren && isExpanded && (
              <div className="ml-4">
                <FolderTree folders={folder.children} />
              </div>
            )}

            {/* In-line folder creation */}
            {isCreatingChild && (
              <div className="ml-10">
                <input
                  className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
                  type="text"
                  placeholder="New Folder"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onBlur={() => handleCreate(folder.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreate(folder.id);
                    } else if (e.key === 'Escape') {
                      setCreatingFolderParentId(null);
                      setFolderName('');
                    }
                  }}
                  autoFocus
                />
              </div>
            )}
          </li>
        );
      })}

      {creatingFolderParentId === null && (
        <li>
          <input
            className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
            type="text"
            placeholder="New Folder"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onBlur={() => handleCreate(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate(null);
              } else if (e.key === 'Escape') {
                setCreatingFolderParentId(undefined);
                setFolderName('');
              }
            }}
            autoFocus
          />
        </li>
      )}
    </ul>
  );
};
