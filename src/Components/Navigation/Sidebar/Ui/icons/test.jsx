'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useAutoSave } from '@/Components/Work_Space/tools/Saving_Logic/Auto-Save';
import { getHasTyped } from "@/Utils/type";
import { ContextClick } from '@/Zustand/Context_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useMoveLogic } from '@/Components/Navigation/Sidebar/Actions/Move';
import { useFileColor } from "@/Components/Navigation/Sidebar/Ui/Colors/FileColor";

import { iconsData } from "@/Utils/icons/IconData";

function FileRender({ file, index, folder }) {
  const {
    editFileId,
    setEditFileId,
    setEditFileName,
    updateFileColor,
    setEditFileContent,
    handleSubmitUpdate,
  } = useFileStore();

  const { handleDrop, setDraggingIndex, setDragOverIndex, moveFolder } = useMoveLogic();
  const { setContextMenuPosition, setContextMenuVisible, setContextMenuTarget } = ContextClick();
  const { handleUpdateFile } = useFileListLogic();
  const { saveNow } = useAutoSave(() => handleSubmitUpdate(handleUpdateFile));
  const { onColorClick, dotClass } = useFileColor(file, updateFileColor, handleUpdateFile);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(file.iconId || 1);

  const handleClick = (e) => {
    e.stopPropagation();
    if (getHasTyped()) saveNow();
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

  const handleSaveIconId = async () => {
    await handleUpdateFile({
      id: file.id,
      iconId: selectedIconId,
    });
    setShowPopup(false);
  };

  return (
    <li
      key={file.id}
      draggable
      onDragStart={() => setDraggingIndex(index)}
      onDragEnter={() => setDragOverIndex(index)}
      onDragEnd={() =>
        handleDrop({
          files: folder.files,
          fileId: file.id,
          targetFolderId: moveFolder,
        })
      }
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
        editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      {/* Color dot */}
      <div
        onClick={onColorClick}
        className="w-6 h-6 flex items-center justify-center absolute -translate-x-3 -translate-y-3 cursor-default"
      >
        <span className={`w-[5px] h-[5px] rounded-full ${dotClass}`} />
      </div>

      {/* File icon & title */}
      <div className="flex items-center space-x-2">
        <Image
          src={iconsData[file.iconId] || iconsData[1]}
          alt="File Icon"
          width={20}
          height={20}
    
        />
        <span className="text-left">{file.title}</span>
      </div>

      {/* Change Icon Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedIconId(file.iconId || 1);
          setShowPopup(true);
        }}
        className="ml-2 px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Change Icon
      </button>

      {/* Icon Picker Popup */}
      {showPopup && (
        <div className="absolute top-1/2 left-1/2 bg-white p-4 rounded shadow-md z-50 transform -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-sm mb-2">Select an Icon</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(iconsData).map(([id, icon]) => (
              <button
                key={id}
                onClick={() => setSelectedIconId(Number(id))}
                className={`border rounded p-1 ${selectedIconId === Number(id) ? 'border-indigo-500' : 'border-gray-300'}`}
              >
                <Image src={icon} alt={`Icon ${id}`} width={24} height={24} />
              </button>
            ))}
          </div>
          <div className="flex space-x-2 mt-2 justify-end">
            <button
              onClick={handleSaveIconId}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default FileRender;
