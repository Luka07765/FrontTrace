import { useState } from 'react';
import TagManager from '../../../../app/notebook/application/tag/tools/CreateTag';
const MenuBar = ({ editor ,fileId}) => {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleNeon = () => editor.chain().focus().toggleMark('neonText').run();
  const toggleHighlight = () => editor.chain().focus().toggleMark('highlightText').run();
  const toggleProgram = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleH1 = () => editor.chain().focus().toggleMark("h1").run();

    const [showTagManager, setShowTagManager] = useState(false);
      const togglePopup = () => setShowTagManager(prev => !prev);
  return (
    <div className="flex flex-wrap gap-1 mb-2 bg-white p-2 rounded-t-lg border-b border-gray-700">
      <button
        onClick={toggleBold}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive('bold') ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
      >
        <span className="font-bold">B</span>
      </button>

      <button
        onClick={toggleNeon}
        className={`p-2 rounded ${
          editor.isActive('neonText') ? 'bg-neon' : 'hover:bg-gray-800'
        }`}
      >
        🌟 Neon
      </button>

      <button
        onClick={toggleProgram}
        className={`p-2 rounded ${
          editor.isActive('codeBlock') ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
      >
        Toggle Code Block
      </button>
      <button
        onClick={toggleH1}
        className={`p-2 rounded ${
          editor.isActive('h1') ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
      >
        H1
      </button> 
      <button
          onClick={togglePopup}
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Show Tag Manager
        </button>

      <button
        onClick={toggleHighlight}
        className={`p-2 rounded ${
          editor.isActive('highlightText')
            ? 'bg-yellow-300 text-black'
            : 'hover:bg-gray-800'
        }`}
      >
        ✨ Highlight
      </button>

        {showTagManager && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <div className="mt-2">
              <TagManager fileId={fileId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
