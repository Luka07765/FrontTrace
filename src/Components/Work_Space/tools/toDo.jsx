import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useEffect } from 'react';

import UndoRedoButtons from './tools/Tool-Bar/Bar';
export default function FileList() {
  const { handleUpdateFile } = useFileListLogic();
  const {
    editFileId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
    handleSubmitUpdate,
    snapshot,
    undo,
    redo,
  } = useFileStore();
  const saveTimeout = useRef(null);

  const hasTypedRef = useRef(false);

  const handleDebouncedChange = (e, setter) => {
    setter(e.target.value);

    if (!hasTypedRef.current) {
      hasTypedRef.current = true;
      console.log('User started typing... Triggering action ONCE.');
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      snapshot();
      handleSubmitUpdate(handleUpdateFile);
      hasTypedRef.current = false;
    }, 2000);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasTypedRef.current === true) {
        handleSubmitUpdate(handleUpdateFile);
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleSubmitUpdate, handleUpdateFile]);

  useEffect(() => {
    if (!hasTypedRef.current) return;

    const interval = setInterval(() => {
      if (hasTypedRef.current) {
        handleSubmitUpdate(handleUpdateFile);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasTypedRef.current]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <UndoRedoButtons undo={undo} redo={redo} />
      <div className="space-y-4">
        {editFileId && (
          <>
            <div>
              <input
                className="w-full px-4 py-2 text-white text-lg font-bold bg-[#12131c] focus:outline-none focus:border-transparent"
                type="text"
                placeholder="File Title"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
                onBlur={() => {
                  snapshot();
                  handleSubmitUpdate(handleUpdateFile);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    snapshot();
                    handleSubmitUpdate(handleUpdateFile);
                  }
                }}
              />
            </div>{' '}
            <textarea
              placeholder="File Content"
              value={editFileContent}
              onChange={(e) => handleDebouncedChange(e, setEditFileContent)}
              className="w-full h-screen text-white bg-[#12131c] px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button onClick={undo} className="px-4 py-2 border rounded">
                Undo
              </button>
              <button onClick={redo} className="px-4 py-2 border rounded">
                Redo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
