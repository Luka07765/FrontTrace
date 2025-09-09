'use client';
import { useState } from 'react';
import Image from 'next/image';
import fileIcon from '@/assets/FolderFile_Icons/file.png';
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
  const [newIconId, setNewIconId] = useState(file.iconId || 1);

  const handleClick = (e) => {
    e.stopPropagation();
    if (getHasTyped()) {
      saveNow();
    }
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
      iconId: newIconId, // ✅ updating with chosen number
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
      <div
        onClick={onColorClick}
        className="w-6 h-6 flex items-center justify-center absolute -translate-x-3 -translate-y-3 cursor-default"
      >
        <span className={`w-[5px] h-[5px] rounded-full ${dotClass}`} />
      </div>

      <div className="flex items-center space-x-2">
        <Image
          src={iconsData[file.iconId]}
          alt="File Icon"
          width={20}
          height={20}
          className="filter invert"
        />
        <span className="text-left">{file.title}</span>
      </div>

      {/* 🔹 Change Icon button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(true);
        }}
        className="ml-2 px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Change Icon
      </button>

      {/* 🔹 Popup for entering icon number */}
      {showPopup && (
        <div className="absolute top-1/2 left-1/2 bg-white p-4 rounded shadow-md z-50">
          <h3 className="text-sm mb-2">Enter Icon Number</h3>
          <input
            type="number"
            value={newIconId}
            onChange={(e) => setNewIconId(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleSaveIconId}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="px-3 py-1 bg-gray-300 rounded"
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
