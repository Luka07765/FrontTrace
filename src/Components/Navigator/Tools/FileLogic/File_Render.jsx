"use client"

import {useState} from "react"
import Image from 'next/image';
import fileIcon from '@/assets/FolderFile_Icons/file.png';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
function FileRender({ file,index, onDragStart, onDragEnter, onDragEnd,onDragEXample}) {
  const {
    editFileId,
    setEditFileId,
    setEditFileName,
    updateFileColor,
    setEditFileContent,
  } = useFileStore();
    const { handleUpdateFile } = useFileListLogic();
     const [positionInput, setPositionInput] = useState(file.filePosition ?? 0);
  const cycleColor = (c) => {
    const order = ['Green','Yellow','Red'];
    const i = order.indexOf(c);
    return order[(i + 1) % order.length];
  };
  
  const onColorClick = async (e) => {
  e.stopPropagation();
  const newColor = cycleColor(file.colors);


  updateFileColor(file.id, newColor);

  try {
    await handleUpdateFile({ id: file.id, colors: newColor });
  } catch (err) {
    console.error('Failed to update color', err);
  }
};
  
  const dotClass = {
    Red:    'bg-red-500',
    Yellow: 'bg-yellow-500',
    Green:  'bg-green-500',
  }[file.colors] || 'bg-gray-400';

  


  return (
    <div>
      <li
        key={file.id}
            draggable
      onDragStart={() => {
  onDragStart(index);

}}
  onDragEnter={() => {
           
          onDragEnter(index);
       
        }}
    onDragEnd={() => {
  onDragEnd();
  onDragEXample();
}}

  
        onClick={(e) => {
          e.stopPropagation();
 
          setEditFileId(file.id);
          setEditFileName(file.title);
          setEditFileContent(file.content);
          
        }}

        className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
          editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
        }`}
      >     <div
  onClick={onColorClick}
  className="w-6 h-6 flex items-center justify-center absolute -translate-x-3 -translate-y-3 cursor-pointer"
>
  <span
    className={`w-[6px] h-[6px] rounded-full ${dotClass}`}
  />
</div>

        <div className="flex items-center space-x-2">
          <Image
            src={fileIcon}
            alt="File Icon"
            width={20}
            height={20}
            className="filter invert"
          />
          <span className="text-left"> {file.title}           {file.filePosition}</span>
     

                  <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-16 px-2 py-1 rounded bg-gray-700 text-white"
            value={positionInput}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setPositionInput(e.target.value)}
          />
    
        </div>
        </div>
      </li>
    </div>
  );
}

export default FileRender;
