import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef } from 'react';

export default function FileList() {
  const { handleUpdateFile } = useFileListLogic();
  const {
    editFileId,
    editFileName,
    setEditFileName,
    setEditFileContent,
    handleSubmitUpdate,
    snapshot,
    undo,
    redo,
  } = useFileStore();

  const saveTimeout = useRef(null);
  const contentEditableRef = useRef(null);

  // Debounce funkcija za ažuriranje sadržaja nakon kucanja
  const handleDebouncedChange = (value) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      snapshot();
      setEditFileContent(value);
      handleSubmitUpdate(handleUpdateFile);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        {editFileId && (
          <>
            {/* Input za naziv fajla */}
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
            </div>

            {/* contentEditable za sadržaj fajla */}
            <div
              ref={contentEditableRef}
              contentEditable={true}
              suppressContentEditableWarning={true} // Izbegava React warning
              className="content-editable w-full h-screen text-white bg-[#12131c] px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
              placeholder="File Content"
              onInput={(e) => handleDebouncedChange(e.currentTarget.innerHTML)}
              onBlur={() => {
                snapshot();
                setEditFileContent(contentEditableRef.current.innerHTML);
                handleSubmitUpdate(handleUpdateFile);
              }}
            />

            {/* Undo / Redo dugmići */}
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
