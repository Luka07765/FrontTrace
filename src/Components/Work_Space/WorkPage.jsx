import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useEffect, useState } from 'react';
import { Mark } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from '@/Components/Work_Space/tools/Tool-Bar/Editor';

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
  const typingTimeout = useRef(null);
  const [styles, setStyles] = useState({
    blur: false,
  });
  const [isTyping, setIsTyping] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, NeonText],
    content: editFileContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditFileContent(html);
      setIsTyping(true);

      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        handleSubmitUpdate(handleUpdateFile);
      }, 500);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 400);
    },
  });

  const toggleNeon = () => {
    editor?.chain().focus().toggleNeon().run(); // Now matches the command name in the extension
  };

  useEffect(() => {
    if (editFileId) {
      editor.commands.setContent(editFileContent || '');
    }
  }, [editFileId]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);
  const toggleStyle = (styleName) => {
    setStyles((prev) => ({ ...prev, [styleName]: !prev[styleName] }));
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    handleSubmitUpdate(handleUpdateFile);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-10 ">
        {editFileId && (
          <>
            <div>
              <input
                className={`w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white                   ${
                  styles.blur && !isTyping ? 'blur-md' : ''
                } `}
                type="text"
                placeholder="File Title"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
                onBlur={() => {
                  handleSubmitUpdate(handleUpdateFile);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();

                    handleSubmitUpdate(handleUpdateFile);
                  }
                }}
              />
            </div>{' '}
            <button
              onClick={toggleNeon}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              ✨ Toggle Neon
            </button>{' '}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => toggleStyle('blur')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {styles.blur ? 'Unblur' : 'Blurify'}
              </button>
            </div>
            <div className="bg-[#12131c] rounded-lg border border-gray-700">
              <MenuBar editor={editor} className="border-none" />{' '}
              <EditorContent
                editor={editor}
                className={`text-white min-h-[600px] px-4 py-2 pb-[200px] text-[25px] focus:outline-none    ${
                  styles.blur && !isTyping ? 'blur-sm' : ''
                }`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
