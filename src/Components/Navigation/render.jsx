// FolderTree.jsx
import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Click } from '@/Zustang/ClickLogic';

export const FolderTree = ({ folders }) => {
  const {
    expandedFolders,
    setExpandedFolders,
    selectedFolderId,
    setSelectedFolderId,
    setContextMenuVisible,
    setContextMenuPosition,
  } = Click();

  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const hasChildren = folder.children.length > 0;

        return (
          <li key={folder.id}>
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
              {hasChildren ? (
                <span
                  onClick={() => setExpandedFolders(folder.id)}
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
                <strong>{folder.title + ' '}</strong>
                <strong>{' ID: ' + folder.id}</strong>
                <strong>{'  PARENT ' + folder.parentFolderId}</strong>
              </div>
            </div>

            {/* Render children recursively if expanded */}
            {hasChildren && isExpanded && (
              <div className="ml-4">
                <FolderTree folders={folder.children} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
