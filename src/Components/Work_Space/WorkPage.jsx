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
  const [styles, setStyles] = useState({
    blur: false,
    smallText: false,
    contrastInvert: false,
    glitch: false,
    rainbow: false,
    chaos: false, // Add chaos to the styles state
  });
  const originalContent = useRef(editFileContent);
  const originalTitle = useRef(editFileName);

  useEffect(() => {
    originalContent.current = editFileContent;
    originalTitle.current = editFileName;
  }, [editFileId, editFileContent, editFileName]);

  const handleDebouncedChange = (e, setter) => {
    setter(e.target.value);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      snapshot();
      handleSubmitUpdate(handleUpdateFile);
    }, 2000);
  };

  const toggleStyle = (styleName) => {
    setStyles((prev) => ({ ...prev, [styleName]: !prev[styleName] }));
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    snapshot();
    handleSubmitUpdate(handleUpdateFile);
  };

  const handleReset = () => {
    setStyles({
      blur: false,
      smallText: false,
      contrastInvert: false,
      glitch: false,
      rainbow: false,
      chaos: false, // Reset chaos as well
    });
    setEditFileName(originalTitle.current);
    setEditFileContent(originalContent.current);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    snapshot();
    handleSubmitUpdate(handleUpdateFile);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <style>{`
        @keyframes glitch {
          0% { text-shadow: 2px 0 red, -2px 0 cyan; }
          25% { text-shadow: -3px 0 yellow, 3px 0 magenta; }
          50% { text-shadow: 2px 0 lime, -2px 0 blue; }
          75% { text-shadow: -3px 0 pink, 3px 0 orange; }
          100% { text-shadow: 2px 0 teal, -2px 0 purple; }
        }

       @keyframes chaos {
  0% {
    opacity: 0.5;
    color: #ff6347; /* Soft red */
    transform: scale(1) rotate(0deg);
    letter-spacing: 1px;
  }
  25% {
    opacity: 0.8;
    color: #32cd32; /* Soft green */
    transform: scale(1.05) rotate(5deg);
    letter-spacing: 1.5px;
  }
  50% {
    opacity: 0.7;
    color: #ffb6c1; /* Soft pink */
    transform: scale(1) rotate(-5deg);
    letter-spacing: 2px;
  }
  75% {
    opacity: 1;
    color: #00bfff; /* Soft blue */
    transform: scale(1.05) rotate(5deg);
    letter-spacing: 1.5px;
  }
  100% {
    opacity: 0.6;
    color: #ffff00; /* Soft yellow */
    transform: scale(1) rotate(0deg);
    letter-spacing: 1px;
  }
}

.chaos-animation {
  animation: chaos 2s infinite alternate; /* Slower animation with less movement */
  text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.3), -2px -2px 4px rgba(0, 255, 0, 0.3);
  filter: brightness(1.2) contrast(1.1);
}

        .chaos-animation {
          animation: chaos 0.3s infinite alternate;
          text-shadow: 2px 2px 4px rgba(255,0,0,0.5),
                      -2px -2px 4px rgba(0,255,0,0.5);
        }

        .chaos-animation::nth-child(odd) {
          animation-delay: 0.1s;
          transform: translateY(-2px);
        }

        .chaos-animation::nth-child(even) {
          animation-delay: 0.2s;
          transform: translateY(2px);
        }
      `}</style>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => toggleStyle('blur')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {styles.blur ? 'Unblur' : 'Blurify'}
        </button>

        <button
          onClick={() => toggleStyle('smallText')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {styles.smallText ? 'Normal Size' : 'Shrink Text'}
        </button>

        <button
          onClick={() => toggleStyle('contrastInvert')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          {styles.contrastInvert ? 'Normal Colors' : 'Contrast Madness'}
        </button>

        <button
          onClick={() => toggleStyle('glitch')}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          {styles.glitch ? 'Stop Glitch' : 'Activate Glitch'}
        </button>

        <button
          onClick={() => toggleStyle('rainbow')}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
        >
          {styles.rainbow ? 'Normal Colors' : 'Rainbow Chaos'}
        </button>

        <button
          onClick={() => toggleStyle('chaos')}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          {styles.chaos ? 'Stop Chaos' : 'Activate Chaos'}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-10">
        {editFileId && (
          <>
            <div>
              <input
                className={`w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none transition-all duration-300
                  ${styles.blur ? 'blur-md' : ''}
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
                ${styles.blur ? 'blur-sm' : ''}
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
