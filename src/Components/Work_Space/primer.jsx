import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useEffect, useRef } from 'react';
import './test.css';
export default function FileList() {
  const { handleUpdateFile } = useFileListLogic();
  const {
    editFileId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
    handleSubmitUpdate,
  } = useFileStore();
  const saveTimeout = useRef(null);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: editFileContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditFileContent(html);

      // Debounced auto-save
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        handleSubmitUpdate(handleUpdateFile);
      }, 2000);
    },
  });

  // Sync editor content when editFileContent changes externally
  useEffect(() => {
    if (editor && !editor.isDestroyed && editFileContent !== editor.getHTML()) {
      editor.commands.setContent(editFileContent);
    }
  }, [editFileContent, editor]);

  // ... (keep your existing imports and setup)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-10">
        {editFileId && (
          <>
            {/* Title input remains the same */}
            <div>
              <input
                className="w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white"
                type="text"
                placeholder="File Title"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
                onBlur={() => handleSubmitUpdate(handleUpdateFile)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitUpdate(handleUpdateFile);
                  }
                }}
              />
            </div>

            {/* Enhanced Tiptap Editor with Creative CSS */}
            <div className="creative-editor">
              <div className="toolbar">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor?.isActive('bold') ? 'active' : ''}
                >
                  <span className="icon">𝐁</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor?.isActive('italic') ? 'active' : ''}
                >
                  <span className="icon">𝐼</span>
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={
                    editor?.isActive('heading', { level: 1 }) ? 'active' : ''
                  }
                >
                  <span className="icon">H1</span>
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().setColor('#ff5e5e').run()
                  }
                >
                  <span className="icon" style={{ color: '#ff5e5e' }}>
                    A
                  </span>
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHighlight({ color: '#fff176' })
                      .run()
                  }
                >
                  <span className="icon">🖍️</span>
                </button>
              </div>

              <EditorContent editor={editor} className="editor-content" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
