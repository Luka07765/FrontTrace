'use client';
import Image from 'next/image';
import { useAutoSave } from '@/Components/Work_Space/tools/Saving_Logic/Auto-Save';
import { getHasTyped } from "@/Utils/type";
import { ContextClick } from '@/Zustand/Context_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/GraphQl/Operations/Logic/File_Logic';
import { useMoveLogic } from '@/Components/Sidebar/Logic/Actions/Move';
import {useFileColor} from "@/Components/Sidebar/Logic/L_Colors/FileColor"
import { useIconPickerStore } from "@/Zustand/Icon";
import { iconsData } from "@/Utils/icons/IconData";
import { useFetchTags } from "@/Server/GraphQl/Operations/FetchTag";
import React,{useState} from 'react';
import { useTagLogic } from "@/Server/GraphQl/Operations/Logic/Tag_Logic";
import { useRouter } from "next/navigation";
function FileRender({ file, index, folder }) {
  const {
    fileId,handleSubmitUpdate
  } = useFileStore();
  const setActiveFileId = useFileStore((s) => s.setActiveFileId);
      const {
    handleDrop,

    setDragIdx,
    setDragOver,
    moveFolder,
  } = useMoveLogic();
    const { tags: allTags } = useFetchTags();
  const { handleContextMenu , setIconSelected } = ContextClick();
  const { handleUpdateFile } = useFileListLogic();
  const { saveNow } = useAutoSave(() => handleSubmitUpdate(handleUpdateFile));
  const { onColorClick, dotClass } = useFileColor(file, handleUpdateFile);
  const router = useRouter();
  const fileSelect = useFileStore((state) => state.handleFileClick);
  const { handleAssignTagToFile, handleRemoveTagFromFile } = useTagLogic();
  
    const [showTagPicker, setShowTagPicker] = useState(false);
    const toggleTagPicker = (e) => {
    e.stopPropagation();
    setShowTagPicker((prev) => !prev);
  };

  return (
    <li
      key={file.id}
      draggable
      onDragStart={() => setDragIdx(index)}
      onDragEnter={() => setDragOver(index)}
      onDragEnd={() => handleDrop({ files: folder.files, fileId: file.id, targetFolderId: moveFolder,fileMain:file })}
//        onClick={() => {
//   setActiveFileId(file.id);       // send only the file ID to Zustand
//   router.push(`/notebook/application/files/${file.id}`); // navigate to file page (optional)
// }}
      onClick={() => fileSelect(file, getHasTyped, saveNow)}
       onContextMenu={(e) => handleContextMenu(e, 'file')}
      className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
        fileId === file.id ? 'ring-2 ring-indigo-500' : ''
      }`}
    >

         
               {showTagPicker && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded shadow-lg z-50 p-2">
          <p className="font-semibold text-gray-700 mb-2">Manage Tags:</p>
          {allTags?.map((tag) => (
            <div key={tag.id} className="flex justify-between items-center">
              <span
                className="flex items-center gap-1 text-sm"
                style={{ color: tag.color }}
              >
                ● {tag.title}
              </span>
              <button
                onClick={() => handleAssignTagToFile(file.id, tag.id)}
                className="text-blue-500 text-xs"
              >
                Assign
              </button>
              <button
                onClick={() => handleRemoveTagFromFile(file.id, tag.id)}
                className="text-red-500 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}      <button
        onClick={toggleTagPicker}
        className="ml-2 px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Manage Tags
      </button>
      <div
        onClick={onColorClick}
        className="w-6 h-6 flex items-center justify-center absolute -translate-x-3 -translate-y-3 cursor-default"
      >
        <span className={`w-[5px] h-[5px] rounded-full ${dotClass}`} />
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
     <button
  onClick={(e) => {
    e.stopPropagation();
    setIconSelected(file.iconId );
    useIconPickerStore.getState().setOpen(true, file); 
  }}
  className="ml-1 px-1 py-1 text-xs  rounded hover:bg-indigo-400"
>
  
<Image
  src={iconsData[file.iconId]?.image || iconsData[1].image}
  alt={iconsData[file.iconId]?.name || "File Icon"}
  width={30}
  height={30}
/>
</button>

<span className="text-left text-white">{file.title}-{file.filePosition}</span>
{file.tags && file.tags.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-1">
    {file.tags.map(tag => (
      <span
        key={tag.id}
        className="px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: tag.color || "#444" }}
      >
       TAG {tag.title}
      </span>
    ))}
  </div>
)}

      </div>
    </li>
  );
}

export default React.memo(FileRender);