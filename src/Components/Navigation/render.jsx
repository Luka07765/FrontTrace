import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

export function RenderFolders({
  folders,
  expandedFolders,
  setExpandedFolders,
  selectedFolderId,
  setSelectedFolderId,
  setContextMenuVisible,
  setContextMenuPosition,
  setEditingFolderId,
  setEditingFolderTitle,
  setParentFolderId,
  editingFolderId,
  editingFolderTitle,
  saveEdit,
  folderName,
  setFolderName,
  handleUpdateFolder,
  handleCreateFolder,
  Create,
  parentFolderId,
}) {
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
                <span className="mr-4" />
              )}
              {editingFolderId !== folder.id ? (
                <div
                  className="flex-grow cursor-pointer"
                  onClick={() =>
                    setSelectedFolderId(
                      selectedFolderId === folder.id ? null : folder.id
                    )
                  }
                  onDoubleClick={() => {
                    setEditingFolderId(folder.id);
                    setEditingFolderTitle(folder.title);
                    setParentFolderId(folder.parentFolderId);
                  }}
                >
                  <strong>{folder.title}</strong>
                </div>
              ) : (
                <input
                  className="bg-gray-800 text-white px-2 py-1 rounded focus:outline-none"
                  value={editingFolderTitle}
                  onChange={(e) => setEditingFolderTitle(e.target.value)}
                  onBlur={() =>
                    saveEdit(
                      folder.id,
                      editingFolderTitle,
                      folder.parentFolderId,
                      handleUpdateFolder
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEdit(
                        folder.id,
                        editingFolderTitle,
                        folder.parentFolderId,
                        handleUpdateFolder
                      );
                    }
                  }}
                  autoFocus
                />
              )}
              <button
                onClick={() => {
                  setParentFolderId(folder.id);
                  setFolderName('');
                }}
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
              >
                + Add
              </button>
            </div>
            {hasChildren && isExpanded && (
              <div className="ml-4">
                <RenderFolders
                  folders={folder.children}
                  expandedFolders={expandedFolders}
                  setExpandedFolders={setExpandedFolders}
                  selectedFolderId={selectedFolderId}
                  setSelectedFolderId={setSelectedFolderId}
                  setContextMenuVisible={setContextMenuVisible}
                  setContextMenuPosition={setContextMenuPosition}
                  setEditingFolderId={setEditingFolderId}
                  setEditingFolderTitle={setEditingFolderTitle}
                  setParentFolderId={setParentFolderId}
                  editingFolderId={editingFolderId}
                  editingFolderTitle={editingFolderTitle}
                  saveEdit={saveEdit}
                  folderName={folderName}
                  setFolderName={setFolderName}
                  handleUpdateFolder={handleUpdateFolder}
                  handleCreateFolder={handleCreateFolder}
                  Create={Create}
                  parentFolderId={parentFolderId}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
