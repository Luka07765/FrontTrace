import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef } from 'react';

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

  // This helper will wrap editFileContent in JSON before calling handleSubmitUpdate
  const handleFinalSave = () => {
    snapshot();
    // Convert the raw text in editFileContent into a JSON delta structure
    const rawText = editFileContent.trim();
    const deltaArray = rawText ? [{ insert: rawText }] : []; // If empty, just send empty array

    // Update editFileContent in the store with the JSON string
    setEditFileContent(JSON.stringify(deltaArray));

    // Now call handleSubmitUpdate which will pass this JSON string to handleUpdateFile
    handleSubmitUpdate(handleUpdateFile);
  };

  const handleDebouncedChange = (e, setter, immediate = false) => {
    setter(e.target.value);

    // Clear the existing timeout
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(
      () => {
        // If you want autosave after a delay, we can also handle JSON conversion here.
        // For simplicity, we'll only do the JSON conversion on the manual save button.
        snapshot();
        handleSubmitUpdate(handleUpdateFile);
      },
      immediate ? 0 : 2000
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        {editFileId && (
          <>
            <input
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
              type="text"
              placeholder="File Title"
              value={editFileName}
              onChange={(e) => handleDebouncedChange(e, setEditFileName, true)}
            />

            <textarea
              placeholder="File Content"
              value={editFileContent}
              onChange={(e) => handleDebouncedChange(e, setEditFileContent)}
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
            />

            {/* Undo/Redo Buttons */}
            <div className="flex space-x-2">
              <button onClick={undo} className="px-4 py-2 border rounded">
                Undo
              </button>
              <button onClick={redo} className="px-4 py-2 border rounded">
                Redo
              </button>
            </div>

            {/* Manual Save Button */}
            <div>
              <button
                onClick={handleFinalSave}
                className="px-4 py-2 border rounded"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
