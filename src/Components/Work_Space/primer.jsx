import { useEditor, EditorContent } from '@tiptap/react';
import { Mark } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useEffect } from 'react';

// RainbowText Extension (unchanged)
const RainbowText = Mark.create({
  name: 'rainbowText',
  addAttributes() {
    return {
      class: {
        default: 'text-rainbow',
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.classList.contains('text-rainbow'),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      toggleRainbow:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },
});

// Corrected NeonText Extension
const NeonText = Mark.create({
  name: 'neonText',
  addAttributes() {
    return {
      class: {
        default: 'text-neon',
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.classList.contains('text-neon'),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      toggleNeon:
        () =>
        ({ commands }) => {
          // Changed from toggleRainbow to toggleNeon
          return commands.toggleMark(this.name);
        },
    };
  },
});

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

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, RainbowText, NeonText],
    content: editFileContent || '<p>Start writing...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditFileContent(html);

      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        handleSubmitUpdate(handleUpdateFile);
      }, 2000);
    },
  });

  useEffect(() => {
    if (editor && editFileContent !== editor.getHTML()) {
      editor.commands.setContent(editFileContent || '');
    }
  }, [editFileContent, editor]);

  const toggleRainbow = () => {
    editor?.chain().focus().toggleRainbow().run();
  };

  const toggleNeon = () => {
    editor?.chain().focus().toggleNeon().run(); // Now matches the command name in the extension
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-10">
        {editFileId && (
          <>
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

            <div className="editor-container">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={toggleRainbow}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  🌈 Toggle Rainbow
                </button>
                <button
                  onClick={toggleNeon}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  ✨ Toggle Neon
                </button>
              </div>
              <EditorContent
                editor={editor}
                className="items-left justify-left text-left w-full h-[630px] text-white bg-[#12131c] px-4 py-2 text-[23px] border-b border-gray-500 focus:outline-none focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
