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
  } = useFileStore();

  const saveTimeout = useRef(null);
  const contentEditableRef = useRef(null);

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
          </>
        )}
      </div>
    </div>
  );
}
