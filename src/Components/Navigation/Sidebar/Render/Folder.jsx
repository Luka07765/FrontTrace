import React from 'react';
import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { useFolderStore } from '@/Zustand/Folder_Store';
import { useSelectStore } from '@/Zustand/Select_Store';
import { ContextClick } from '@/Zustand/Context_Store';
import { useMoveLogic } from '@/Components/Navigation/Sidebar/Actions/Move';
import { useFolderColors } from '@/Components/Navigation/Sidebar/Ui/Colors/ColorLogic';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import folderClosedIcon from '@/assets/FolderFile_Icons/folder.png';
import RenameFolder from '@/Components/Navigation/Sidebar/Actions/Rename_Folder';
import UiColors from '@/Components/Navigation/Sidebar/Ui/Colors/UiColors';

function Folder_Render({ folder }) {

  const { setContextMenuPosition, setContextMenuVisible, setContextMenuTarget } = ContextClick();
  const { selectedFolderId, setSelectedFolderId } = useSelectStore();
  const { 
    expandedFolders, setExpandedFolders, 
    editingFolderId, setDragFolder, dragFolder,
    setNullExpend, setPopupFolder,
    setMoveFolder, moveFolder
  } = useFolderStore();

  const { folderDrop, handleDragEnter, moveFileToFolder } = useMoveLogic(folder.id);
  const { redCount, yellowCount } = useFolderColors(folder);

  const isExpanded = expandedFolders[folder.id];
  const isEditing = editingFolderId === folder.id;

  // === Handlers ===
  const handleClickFolder = (e) => {
    e.stopPropagation();

    if (!folder.parentFolderId || folder.parentFolderId === 'None') {
      setNullExpend(true);
      setPopupFolder(folder);
      return;
    }

    setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id);
    setExpandedFolders(folder.id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setSelectedFolderId(folder.id);
    setContextMenuVisible(true);
    setContextMenuTarget({ type: 'folder' });
    setContextMenuPosition({ x: e.pageX, y: e.pageY - 100 });
  };

  const handleDragEnd = () => {
    folderDrop({ sourceFolderId: dragFolder, targetFolderId: moveFolder });
    setMoveFolder(null);
  };

  // === Render ===
  return (
    <motion.div
      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-600 ${
        selectedFolderId === folder.id ? 'border-2 border-blue-500' : ''
      }`}
      onContextMenu={handleContextMenu}
      onDragOver={(e) => e.preventDefault()}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Chevron */}
      <span onDragEnter={handleDragEnter} onClick={() => setExpandedFolders(folder.id)} className="mr-1">
        {folder.parentFolderId !== 'None' &&
          (isExpanded ? <FaChevronDown className="inline" /> : <FaChevronRight className="inline" />)}
      </span>

      {/* Folder Content */}
      <div onClick={handleClickFolder} className="flex-grow">
        {isEditing ? (
          <RenameFolder folder={folder} />
        ) : (
          <div onDragEnter={moveFileToFolder} className="flex items-center space-x-3">
            {/* Folder Icon */}
            <motion.div>
              <Image
                src={isExpanded ? folderOpenIcon : folderClosedIcon}
                alt={isExpanded ? 'Folder Open' : 'Folder Closed'}
                width={20}
                height={20}
                className="filter invert"
              />
            </motion.div>

            {/* Colors */}
            <UiColors redCount={redCount} yellowCount={yellowCount} />

            {/* Title & Drag Menu */}
            <div className="flex items-center space-x-1">
              <div className="ml-1">{folder.title}</div>
              <div
                draggable
                onDragStart={() => setDragFolder(folder.id)}
                onDragEnd={handleDragEnd}
                title="Drag to move folder"
                className="cursor-grab text-gray-300 hover:text-white"
              >
                <span className="text-xl leading-none select-none">⋮</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Folder_Render;
