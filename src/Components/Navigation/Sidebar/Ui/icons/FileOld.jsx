'use client';
import Image from 'next/image';
import fileIcon from '@/assets/FolderFile_Icons/file.png';
import { useAutoSave } from '@/Components/Work_Space/tools/Saving_Logic/Auto-Save';
import { getHasTyped } from "@/Utils/type";
import { ContextClick } from '@/Zustand/Context_Store';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useMoveLogic } from '@/Components/Navigation/Sidebar/Actions/Move';
import {useFileColor} from "@/Components/Navigation/Sidebar/Ui/Colors/FileColor"
function FileRender({ file, index, folder }) {
  const {
    editFileId,
    setEditFileId,
    setEditFileName,
    updateFileColor,
    setEditFileContent,handleSubmitUpdate
  } = useFileStore();
      const {
    handleDrop,

    setDraggingIndex,
    setDragOverIndex,
    moveFolder,
  } = useMoveLogic();
  const { setContextMenuPosition, setContextMenuVisible, setContextMenuTarget } = ContextClick();
  const { handleUpdateFile } = useFileListLogic();

  const { saveNow } = useAutoSave(() => handleSubmitUpdate(handleUpdateFile));
  const { onColorClick, dotClass } = useFileColor(file, updateFileColor, handleUpdateFile);




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
  return (
    <li
      key={file.id}
      draggable
      onDragStart={() => setDraggingIndex(index)}
      onDragEnter={() => setDragOverIndex(index)}
      onDragEnd={() => handleDrop({ files: folder.files, fileId: file.id, targetFolderId: moveFolder })}

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
        <Image src={fileIcon} alt="File Icon" width={20} height={20} className="filter invert" />
        <span className="text-left">{file.title + file.iconId}
 
           </span>

    
      </div>
    </li>
  );
}

export default FileRender;
