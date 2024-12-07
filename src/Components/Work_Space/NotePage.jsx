'use client';

import React, { useState } from 'react';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import useFileStore from '@/Zustand/File_Store';
export default function FileList() {
  const {
    files,
    loading,
    error,

    handleUpdateFile,
  } = useFileListLogic();

  const {
    editFileId,
    setEditFileId,
    fileName,
    setFileName,
    fileContent,
    setFileContent,
    folderId,
    setFolderId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
  } = useFileStore();

  const resetEditState = () => {
    setEditFileId(null);
    setEditFileName('');
    setEditFileContent('');
    setFolderId('');
  };

  if (loading) return <p className="text-gray-500">Loading files...</p>;
  if (error)
    return <p className="text-red-500">Error loading files: {error.message}</p>;

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
      <div className="mt-10">
        <div className="space-y-4">
          {editFileId && (
            <>
              {' '}
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
            </>
          )}

          <div className="flex space-x-2">
            {editFileId && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
