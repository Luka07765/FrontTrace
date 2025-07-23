const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleNeon = () => editor.chain().focus().toggleMark('neonText').run();
  const toggleHighlight = () => editor.chain().focus().toggleMark('highlightText').run();
  const toggleProgram = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleH1 = () => editor.chain().focus().toggleMark("h1").run();
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
        onClick={toggleHighlight}
        className={`p-2 rounded ${
          editor.isActive('highlightText')
            ? 'bg-yellow-300 text-black'
            : 'hover:bg-gray-800'
        }`}
      >
        ✨ Highlight
      </button>
    </div>
  );
};

export default MenuBar;
