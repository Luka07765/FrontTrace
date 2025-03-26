import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from '@/Components/Work_Space/tools/Tool-Bar/Editor';

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
    extensions: [StarterKit],
    content: editFileContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditFileContent(html);

      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        handleSubmitUpdate(handleUpdateFile);
      }, 2000);
    },
  });
  const editorContentRef = useRef(null);

  useEffect(() => {
    if (editorContentRef.current) {
      editorContentRef.current.style.fontSize = '23px'; // Example styling
      editorContentRef.current.style.color = 'white';
    }
  }, []);
  const changeFontSize = (size) => {
    if (editorContentRef.current) {
      editorContentRef.current.style.fontSize = `${size}px`;
    }
  };

  // Function to change text color
  const changeTextColor = (color) => {
    if (editorContentRef.current) {
      editorContentRef.current.style.color = color;
    }
  };

  // Update editor content when editFileContent changes externally
  useEffect(() => {
    if (editor && editor.getHTML() !== editFileContent) {
      editor.commands.setContent(editFileContent);
    }
    console.log('render');
  }, [editFileContent, editor]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* <UndoRedoButtons undo={undo} redo={redo} /> */}
      <div className="space-y-10 ">
        {editFileId && (
          <>
            <div>
              <input
                className="w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white"
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
              onClick={() => changeFontSize(16)}
              className="p-2 bg-gray-800 text-white rounded"
            >
              Small
            </button>
            <button
              onClick={() => changeFontSize(20)}
              className="p-2 bg-gray-800 text-white rounded"
            >
              Medium
            </button>
            <div className="bg-[#12131c] rounded-lg border border-gray-700">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                ref={editorContentRef}
                className="min-h-[630px] text-white px-4 py-2 text-[23px] focus:outline-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
