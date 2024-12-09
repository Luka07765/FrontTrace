'use client';

import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import useFileStore from '@/Zustand/File_Store';
import { useEffect } from 'react';
export default function FileList() {
  const { handleUpdateFile } = useFileListLogic();

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
      <div className="space-y-4">
        {editFileId && (
          <>
            {' '}
            <input
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent "
              type="text"
              placeholder="File Title"
              value={editFileId ? editFileName : fileName}
              onChange={(e) =>
                editFileId
                  ? setEditFileName(e.target.value)
                  : setFileName(e.target.value)
              }
            />
            <textarea
              placeholder="File Content"
              value={editFileId ? editFileContent : fileContent}
              onChange={(e) =>
                editFileId
                  ? setEditFileContent(e.target.value)
                  : setFileContent(e.target.value)
              }
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
            />
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
  );
}
