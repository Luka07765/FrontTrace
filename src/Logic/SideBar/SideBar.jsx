'use client';

import React, { useState } from 'react';
import { useFolderListLogic } from '@/Data/Apollo/Logic/QuerySideBar';

export default function FolderList() {
  const {
    folders,
    loading,
    error,
    handleCreateFolder,
    handleDeleteFolder,
    handleUpdateFolder,
  } = useFolderListLogic();

  // UI State
  const [folderName, setFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState('');
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editParentFolderId, setEditParentFolderId] = useState('');

  const resetEditState = () => {
    setEditFolderId(null);
    setEditFolderName('');
    setEditParentFolderId('');
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

  const handleSubmitCreate = () => {
    handleCreateFolder({
      title: folderName,
      parentFolderId: parentFolderId ? parseInt(parentFolderId, 10) : null,
    });
    setFolderName('');
    setParentFolderId('');
  };

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Folders</h2>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600"
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
              <div className="flex space-x-1">
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="text-red-400 hover:text-red-500 focus:outline-none"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditFolderId(folder.id);
                    setEditFolderName(folder.title);
                    setEditParentFolderId(
                      folder.parentFolderId
                        ? folder.parentFolderId.toString()
                        : ''
                    );
                  }}
                  className="text-blue-400 hover:text-blue-500 focus:outline-none"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Edit Folder */}
        {editFolderId && (
          <div className="mt-6 p-4 bg-gray-700 rounded">
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
        )}

        {/* Create Folder */}
        <div className="mt-6 p-4 bg-gray-700 rounded">
          <h3 className="text-lg font-semibold mb-2">Create Folder</h3>
          <input
            type="text"
            placeholder="Folder Title"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-2 py-1 mb-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
          />
          <input
            type="number"
            placeholder="Parent Folder ID"
            value={parentFolderId}
            onChange={(e) => setParentFolderId(e.target.value)}
            className="w-full px-2 py-1 mb-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleSubmitCreate}
            className="w-full px-2 py-1 bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none"
          >
            Create Folder
          </button>
        </div>
      </div>

      {/* Main Content Area (Optional) */}
      <div className="flex-1 p-6">{/* Your main content goes here */}</div>
    </div>
  );
}
