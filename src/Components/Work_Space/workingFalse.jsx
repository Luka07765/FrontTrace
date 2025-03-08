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
  const contentEditableRef = useRef(null);
  const isUserInput = useRef(false);
  useEffect(() => {
    if (contentEditableRef.current && !isUserInput.current) {
      contentEditableRef.current.innerHTML = editFileContent;
    }
    isUserInput.current = false;
  }, [editFileContent]);

  const handleDebouncedChange = (value, setter) => {
    setter(value);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      snapshot();
      handleSubmitUpdate(handleUpdateFile);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {' '}
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
            <div
              ref={contentEditableRef}
              contentEditable={true}
              onInput={(e) => {
                isUserInput.current = true;
                const html = e.currentTarget.innerHTML;
                handleDebouncedChange(html, setEditFileContent);
              }}
              className="content-editable w-full h-screen text-white bg-[#12131c] px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
              placeholder="File Content"
            />
          </>
        )}
      </div>
    </div>
  );
}
