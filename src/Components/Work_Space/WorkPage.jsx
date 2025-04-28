import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import {  useEffect, useState } from 'react';

import {  EditorContent } from '@tiptap/react';

import MenuBar from '@/Components/Work_Space/tools/Tool-Bar/ToolBar';
import { useEditorSetup } from './tools/Tool-Bar/Editor';
import { useAutoSave } from './tools/Saving_Logic/Auto-Save';

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

  const { triggerSave } = useAutoSave(() => handleSubmitUpdate(handleUpdateFile));
  
  const handleContentUpdate = (html) => {
    setEditFileContent(html);

    triggerSave();
  };

  


  const { editor, commands } = useEditorSetup(editFileContent, handleContentUpdate);



  useEffect(() => {
    if (editFileId ) {
      editor.commands.setContent(editFileContent || '');
    }
  }, [editFileId]);



  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-10 ">
        {editFileId && (
          <>
            <div>
              <input
                className={`w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white`}
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
       
   
            <div className="bg-[#12131c] rounded-lg border border-gray-700">
              <MenuBar editor={editor} commands={commands} className="border-none" />{' '}
              <EditorContent
                editor={editor}
                className={`text-white min-h-[600px] px-4 py-2 pb-[200px] text-[25px] focus:outline-none `}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
