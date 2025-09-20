'use client';
import Image from 'next/image';
import { useAutoSave } from '@/Components/Work_Space/tools/Saving_Logic/Auto-Save';
import { getHasTyped } from "@/Utils/type";
import { ContextClick } from '@/Zustand/Context_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useMoveLogic } from '@/Components/Sidebar/Logic/Actions/Move';
import {useFileColor} from "@/Components/Sidebar/Logic/L_Colors/FileColor"
import { useIconPickerStore } from "@/Zustand/Icon";
import { iconsData } from "@/Utils/icons/IconData";
import React from 'react';

function FileRender({ file, index, folder }) {
  const {
    fileId,handleSubmitUpdate
  } = useFileStore();
      const {
    handleDrop,

    setDragIdx,
    setDragOver,
    moveFolder,
  } = useMoveLogic();
  const { handleContextMenu , setIconSelected } = ContextClick();
  const { handleUpdateFile } = useFileListLogic();
  const { saveNow } = useAutoSave(() => handleSubmitUpdate(handleUpdateFile));
  const { onColorClick, dotClass } = useFileColor(file, handleUpdateFile);
  const fileSelect = useFileStore((state) => state.handleFileClick);

  return (
    <li
      key={file.id}
      draggable
      onDragStart={() => setDragIdx(index)}
      onDragEnter={() => setDragOver(index)}
      onDragEnd={() => handleDrop({ files: folder.files, fileId: file.id, targetFolderId: moveFolder,fileMain:file })}

      onClick={() => fileSelect(file, getHasTyped, saveNow)}
       onContextMenu={(e) => handleContextMenu(e, 'file')}
      className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
        fileId === file.id ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
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

<span className="text-left text-white">{file.title}-{file.filePosition}
 
 </span>


      </div>
    </li>
  );
}

export default React.memo(FileRender);