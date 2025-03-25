import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useState, useEffect } from 'react';

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
  } = useFileStore();
  const saveTimeout = useRef(null);
  const typingTimeout = useRef(null); // For tracking typing
  const [styles, setStyles] = useState({
    blur: false,
    smallText: false,
    contrastInvert: false,
    glitch: false,
    rainbow: false,
    chaos: false,
  });
  const [isTyping, setIsTyping] = useState(false); // Track typing status
  const originalContent = useRef(editFileContent);
  const originalTitle = useRef(editFileName);

  useEffect(() => {
    originalContent.current = editFileContent;
    originalTitle.current = editFileName;
  }, [editFileId, editFileContent, editFileName]);

  // Handle debounced change for file content
  const handleDebouncedChange = (e, setter) => {
    setter(e.target.value);
    setIsTyping(true); // Mark typing as true
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      snapshot();
      handleSubmitUpdate(handleUpdateFile);
    }, 2000);

    // Reset typing status after a delay
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false); // Mark typing as false when typing stops
    }, 500); // Delay for stopping typing (500ms)
  };

  // Toggle style (for blur, etc.)
  const toggleStyle = (styleName) => {
    setStyles((prev) => ({ ...prev, [styleName]: !prev[styleName] }));
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    snapshot();
    handleSubmitUpdate(handleUpdateFile);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => toggleStyle('blur')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {styles.blur ? 'Unblur' : 'Blurify'}
        </button>
      </div>

      <div className="space-y-10">
        {editFileId && (
          <>
            <div>
              <input
                className={`w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none transition-all duration-300
                  ${styles.blur && !isTyping ? 'blur-md' : ''} 
                  ${styles.smallText ? 'text-[20px]' : ''}
                  ${styles.contrastInvert ? 'contrast-200 invert' : ''}
                  ${styles.glitch ? 'animate-glitch' : ''}
                  ${
                    styles.rainbow
                      ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent'
                      : ''
                  }
                  ${styles.chaos ? 'chaos-animation' : ''}
                `}
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
            <textarea
              placeholder="File Content"
              value={editFileContent}
              onChange={(e) => handleDebouncedChange(e, setEditFileContent)}
              className={`items-left justify-left text-left w-full h-[600px] text-white bg-[#12131c] px-4 py-2 text-[23px] border-b border-gray-500 focus:outline-none transition-all duration-300
                ${styles.blur && !isTyping ? 'blur-sm' : ''}
                ${styles.smallText ? 'text-[16px]' : ''}
                ${styles.contrastInvert ? 'contrast-200 invert' : ''}
                ${styles.glitch ? 'animate-glitch' : ''}
                ${
                  styles.rainbow
                    ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent'
                    : ''
                }
                ${styles.chaos ? 'chaos-animation' : ''}
              `}
            />
          </>
        )}
      </div>
    </div>
  );
}
