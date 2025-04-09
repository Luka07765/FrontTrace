// components/FileList.js
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { EditorContent } from '@tiptap/react';
import MenuBar from '@/Components/Work_Space/tools/Tool-Bar/Editor';
import { useEditorSetup } from './tools/mob1';
import { useAutoSave } from './tools/mob2';
import { useTypingIndicator } from './tools/mob3';
import { useStyles } from './mob4';

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

  const { styles, toggleStyle } = useStyles();
  const { isTyping, startTyping } = useTypingIndicator();
  const { triggerSave } = useAutoSave(() => handleSubmitUpdate(handleUpdateFile));

  const handleContentUpdate = (html) => {
    setEditFileContent(html);
    startTyping();
    triggerSave();
  };

  const { editor, toggleNeon } = useEditorSetup(editFileContent, handleContentUpdate);

  const handleTitleChange = (e) => {
    setEditFileName(e.target.value);
  };

  const handleTitleBlur = () => {
    triggerSave(true);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerSave(true);
    }
  };

  if (!editFileId) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="space-y-10">Select a file to edit</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-10">
        <div>
          <input
            className={`w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white ${
              styles.blur && !isTyping ? 'blur-md' : ''
            }`}
            type="text"
            placeholder="File Title"
            value={editFileName}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
          />
        </div>

        <button
          onClick={toggleNeon}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          ✨ Toggle Neon
        </button>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => toggleStyle('blur')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {styles.blur ? 'Unblur' : 'Blurify'}
          </button>
        </div>

        <div className="bg-[#12131c] rounded-lg border border-gray-700">
          <MenuBar editor={editor} className="border-none" />
          <EditorContent
            editor={editor}
            className={`text-white min-h-[600px] px-4 py-2 pb-[200px] text-[25px] focus:outline-none ${
              styles.blur && !isTyping ? 'blur-sm' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}