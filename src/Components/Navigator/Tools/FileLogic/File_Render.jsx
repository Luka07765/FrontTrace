'use client';

import { useState } from 'react';
import Image from 'next/image';
import fileIcon from '@/assets/FolderFile_Icons/file.png';

import { ContextClick } from '@/Zustand/Context_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';

function FileRender({ file, index, onDragStart, onDragEnter, onDragEnd }) {
  const {
    editFileId,
    setEditFileId,
    setEditFileName,
    updateFileColor,
    setEditFileContent,
  } = useFileStore();

  const { setContextMenuPosition, setContextMenuVisible, setContextMenuTarget } = ContextClick();
  const { handleUpdateFile } = useFileListLogic();



  const cycleColor = (color) => {
    const order = ['Green', 'Yellow', 'Red'];
    const i = order.indexOf(color);
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
    Red: 'bg-red-500',
    Yellow: 'bg-yellow-500',
    Green: 'bg-green-500',
  }[file.colors] || 'bg-gray-400';

  const handleClick = (e) => {
    e.stopPropagation();
    setEditFileId(file.id);
    setEditFileName(file.title);
    setEditFileContent(file.content);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuTarget({ type: 'file' });
    setContextMenuVisible(true);
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
  };

  return (
    <li
      key={file.id}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
        editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      <div
        onClick={onColorClick}
        className="w-6 h-6 flex items-center justify-center absolute -translate-x-3 -translate-y-3 cursor-pointer"
      >
        <span className={`w-[6px] h-[6px] rounded-full ${dotClass}`} />
      </div>

      <div className="flex items-center space-x-2">
        <Image src={fileIcon} alt="File Icon" width={20} height={20} className="filter invert" />
        <span className="text-left">{file.title} {file.filePosition}</span>

    
      </div>
    </li>
  );
}

export default FileRender;
