import React, { useState, useRef } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

export default function FolderList() {
  const {
    folders,
    loading,
    error,
    handleCreateFolder,
    handleDeleteFolder,
    handleUpdateFolder,
  } = useFolderListLogic();

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Context Menu State
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  // Create Folder Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Edit Folder State
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editParentFolderId, setEditParentFolderId] = useState('');

  const resetEditState = () => {
    setEditFolderId(null);
    setEditFolderName('');
    setEditParentFolderId('');
  };

  const CreateFolder = () =>
    handleCreateFolder({
      title: newFolderName,
      parentFolderId: selectedFolderId,
    });

  const handleSubmitUpdate = () => {
    handleUpdateFolder({
      id: editFolderId,
      title: editFolderName,
      parentFolderId: editParentFolderId
        ? parseInt(editParentFolderId, 10)
        : null,
    });
    resetEditState();
  };

  const contextMenuRef = useRef(null);

  const handleClickInside = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setContextMenuVisible(false);
    }
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
      className="flex relative w-64 bg-gray-800 text-white h-screen p-4"
      onClick={handleClickInside}
    >
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li
            key={folder.id}
            onClick={() => {
              setSelectedFolderId(folder.id); // Set selected folder on left-click
              console.log(`Selected Folder ID: ${folder.id}`);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setSelectedFolderId(folder.id); // Set selected folder on right-click
              setContextMenuVisible(true); // Show context menu
              setContextMenuPosition({ x: e.pageX, y: e.pageY });
            }}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              selectedFolderId === folder.id
                ? 'border-2 border-blue-500 bg-gray-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div>
              <strong>{folder.title}</strong>
              <span className="text-sm text-gray-300 ml-2">
                (ID: {folder.id})
              </span>
              {folder.parentFolderId !== null && (
                <span className="text-sm text-gray-300 ml-2">
                  (Parent ID: {folder.parentFolderId})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Folder Modal */}
      {editFolderId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-700 p-6 rounded">
            <h3 className="text-lg font-semibold mb-2">Edit Folder</h3>
            <input
              type="text"
              placeholder="Folder Title"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              className="w-full px-2 py-1 mb-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
            />
            <input
              type="number"
              placeholder="Parent Folder ID"
              value={editParentFolderId}
              onChange={(e) => setEditParentFolderId(e.target.value)}
              className="w-full px-2 py-1 mb-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSubmitUpdate}
                className="w-full px-2 py-1 bg-green-500 rounded hover:bg-green-600 focus:outline-none"
              >
                Save Changes
              </button>
              <button
                onClick={resetEditState}
                className="w-full px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenuVisible && (
        <ul
          ref={contextMenuRef}
          className="absolute bg-black border rounded shadow-md z-50"
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            position: 'fixed',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <li
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setContextMenuVisible(false);
              setShowCreateModal(true);
              setNewFolderName('');
            }}
          >
            Create Folder
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setContextMenuVisible(false);
              const folderToEdit = folders.find(
                (f) => f.id === selectedFolderId
              ); // Use selectedFolderId
              if (folderToEdit) {
                setEditFolderId(folderToEdit.id);
                setEditFolderName(folderToEdit.title);
                setEditParentFolderId(
                  folderToEdit.parentFolderId
                    ? folderToEdit.parentFolderId.toString()
                    : ''
                );
              }
            }}
          >
            Rename Folder
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setContextMenuVisible(false);
              handleDeleteFolder(selectedFolderId); // Use selectedFolderId
            }}
          >
            Delete Folder
          </li>
        </ul>
      )}

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded">
            <input
              type="text"
              placeholder="Folder Title"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-2 py-1 mb-2 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  CreateFolder();
                  setShowCreateModal(false);
                  setNewFolderName('');
                }}
                className="w-full px-2 py-1 bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
