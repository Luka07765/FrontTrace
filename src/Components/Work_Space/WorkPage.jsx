import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useState } from 'react';

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
  const [isBlurred, setIsBlurred] = useState(false); // Track blur state
  const [originalContent, setOriginalContent] = useState(editFileContent); // To store original content for reset

  const handleDebouncedChange = (e, setter) => {
    setter(e.target.value);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      snapshot();
      handleSubmitUpdate(handleUpdateFile);
    }, 2000);
  };

  const handleBlur = () => {
    setIsBlurred(true);
  };

  const handleShuffleText = () => {
    const shuffledContent = editFileContent
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    setEditFileContent(shuffledContent);
  };

  const handleTranslateToChinese = () => {
    // Placeholder for translation API, assuming we set Chinese content for demo
    setEditFileContent('这是中文翻译');
  };

  const handleReset = () => {
    setEditFileContent(originalContent);
    setIsBlurred(false);
    setEditFileName(editFileName); // Reset title to its original value
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* <UndoRedoButtons undo={undo} redo={redo} /> */}
      <div className="space-y-10">
        {editFileId && (
          <>
            <div>
              {' '}
              <div className="space-x-4 mt-4">
                <button
                  onClick={handleBlur}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Blur Title and Content
                </button>
                <button
                  onClick={handleShuffleText}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Shuffle Text
                </button>
                <button
                  onClick={handleTranslateToChinese}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Translate to Chinese
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reset Everything
                </button>
              </div>
              <input
                className="w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white"
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
                style={{ filter: isBlurred ? 'blur(5px)' : 'none' }}
              />
            </div>
            <textarea
              placeholder="File Content"
              value={editFileContent}
              onChange={(e) => handleDebouncedChange(e, setEditFileContent)}
              className="items-left justify-left text-left w-full h-[600px] text-white bg-[#12131c] px-4 py-2 text-[23px] border-b border-gray-500 focus:outline-none focus:border-transparent"
              style={{ filter: isBlurred ? 'blur(5px)' : 'none' }}
            />
          </>
        )}

        {/* Action buttons */}
      </div>
    </div>
  );
}
