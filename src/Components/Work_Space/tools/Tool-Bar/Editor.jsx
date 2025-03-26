const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mb-2 bg-white p-2 rounded-t-lg border-b border-gray-700">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive('bold') ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
      >
        <span className="font-bold">B</span>
      </button>
    </div>
  );
};

export default MenuBar;
