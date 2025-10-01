import React, { useState } from 'react';
import { motion } from 'framer-motion';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import { useFolderStore } from '@/Zustand/Folder_Store';

function Folder_Render({ folder, expand }) {
  const { setNullExpend } = useFolderStore();
  const [hovered, setHovered] = useState(false);

  const handleClickFolder = (e) => {
    e.stopPropagation();
    if (folder.parentFolderId === 'None') {
      setNullExpend(true);
      return;
    }
  };

  return (
    <motion.div
      className="relative flex items-center pr-6 ml-2 justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        onClick={handleClickFolder} 
        className="flex items-center space-x-3 overflow-hidden"
      >
        <motion.img
          src={folderOpenIcon.src}
          alt="Folder Open"
          width={50}
          height={50}
          className="filter invert flex-shrink-0"
          animate={{ width: expand ? 24 : 60, height: expand ? 24 : 60 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        />
        <span className="text-white font-medium text-base whitespace-nowrap truncate">
          {folder.title}
        </span>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: -10 }}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-1
                     px-3 py-1 bg-yellow-400 bg-opacity-80 rounded-lg shadow-lg z-50"
        >
          <span className="text-black font-medium whitespace-nowrap">{folder.title}</span>
        </motion.div>
      )}

      {/* Right side: grab handle */}
      <div className="cursor-grab text-gray-400 hover:text-white select-none">
        <span className="text-xl leading-none">⋮</span>
      </div>
    </motion.div>
  );
}

export default Folder_Render;
