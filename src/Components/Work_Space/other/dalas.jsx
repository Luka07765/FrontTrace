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

  // Helper to parse JSON delta into plain text for rendering
  const parseDeltaToPlainText = (deltaJson) => {
    try {
      const deltaArray = JSON.parse(deltaJson || '[{ "Insert": "" }]');
      return deltaArray.map((delta) => delta.insert || '').join('');
    } catch {
      return ''; // Fallback for invalid JSON
    }
  };

  // Helper to convert plain text back into JSON delta
  const convertPlainTextToDelta = (plainText) => {
    return JSON.stringify([{ insert: plainText }]); // Simple delta structure
  };

  // Handle input changes
  const handleDebouncedChange = (e, setter, immediate = false) => {
    const newValue = e.target.value;

    // Convert plain text to JSON delta for content updates
    if (setter === setEditFileContent) {
      const newDelta = convertPlainTextToDelta(newValue);
      setter(newDelta);
    } else {
      setter(newValue); // For file name updates, no conversion is needed
    }

    // Clear existing timeout
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // Debounced save
    saveTimeout.current = setTimeout(
      () => {
        snapshot();
        handleSubmitUpdate(handleUpdateFile);
      },
      immediate ? 0 : 2000
    );
  };

  // Parse the JSON delta content for display in the <textarea>
  const parsedFileContent = parseDeltaToPlainText(editFileContent);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        {editFileId && (
          <>
            {/* File Title Input */}
            <input
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
              type="text"
              placeholder="File Title"
              value={editFileName}
              onChange={(e) => handleDebouncedChange(e, setEditFileName, true)}
            />

            {/* File Content Textarea */}
            <textarea
              placeholder="File Content"
              value={parsedFileContent} // Display plain text
              onChange={(e) => handleDebouncedChange(e, setEditFileContent)} // Convert plain text back to delta
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
          </>
        )}
      </div>
    </div>
  );
}
