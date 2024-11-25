'use client';

import React, { useState } from 'react';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';

export default function FileList() {
  const {
    files,
    loading,
    error,
    handleCreateFile,
    handleDeleteFile,
    handleUpdateFile,
  } = useFileListLogic();

  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [folderId, setFolderId] = useState('');

  const [editFileId, setEditFileId] = useState(null);
  const [editFileName, setEditFileName] = useState('');
  const [editFileContent, setEditFileContent] = useState('');

  const resetEditState = () => {
    setEditFileId(null);
    setEditFileName('');
    setEditFileContent('');
    setFolderId('');
  };

  if (loading) return <p className="text-gray-500">Loading files...</p>;
  if (error)
    return <p className="text-red-500">Error loading files: {error.message}</p>;

  const handleSubmitCreate = () => {
    const newFileId = `file-${Date.now()}`; // Generate unique file ID
    handleCreateFile({
      id: newFileId,
      title: fileName,
      content: fileContent,
      folderId: parseInt(folderId, 10),
    });
    setFileName('');
    setFileContent('');
    setFolderId('');
  };

  const handleSubmitUpdate = () => {
    handleUpdateFile({
      id: editFileId,
      title: editFileName,
      content: editFileContent,
      folderId,
    });
    resetEditState();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Files</h2>
      <ul className="space-y-4">
        {files.map((file) => (
          <li
            key={file.id}
            onClick={() => {
              setEditFileId(file.id);
              setEditFileName(file.title);
              setEditFileContent(file.content);
              setFolderId(file.folderId);
            }}
            className={`bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer ${
              editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            <div>
              <h3 className="text-xl font-semibold">{file.title}</h3>
              <p className="text-gray-600 mt-1">{file.content}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">
          {editFileId ? 'Edit File' : 'Create File'}
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="File Title"
            value={editFileId ? editFileName : fileName}
            onChange={(e) =>
              editFileId
                ? setEditFileName(e.target.value)
                : setFileName(e.target.value)
            }
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="File Content"
            value={editFileId ? editFileContent : fileContent}
            onChange={(e) =>
              editFileId
                ? setEditFileContent(e.target.value)
                : setFileContent(e.target.value)
            }
            className="w-full px-4 py-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Folder ID"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex space-x-2">
            {editFileId ? (
              <>
                <button
                  onClick={handleSubmitUpdate}
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                  Save Changes
                </button>
                <button
                  onClick={resetEditState}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmitCreate}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                Create File
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
