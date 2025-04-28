const MenuBar = ({ editor, commands }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-2 bg-white p-2 rounded-t-lg border-b border-gray-700">
      <button
        onClick={commands.toggleBold}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive('bold') ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={commands.toggleNeon}
        className={`p-2 rounded ${
          editor.isActive('neonText') ? 'bg-neon' : 'hover:bg-gray-800'
        }`}
      >
        🌟 Neon
      </button>     
      <button onClick={commands.toggleProgram } className={editor.isActive('codeBlock') ? 'is-active' : ''}>
          Toggle code block
        </button>
    </div>
  );
};

export default MenuBar;