import React from 'react';

import { motion } from 'framer-motion';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';

function Folder_Render({ folder,expand }) {

  return (
    <motion.div
      className="flex items-center  pr-6 ml-2 justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >

      <div 

      className="flex items-center space-x-3 overflow-hidden">
           <motion.img
                  src={folderOpenIcon.src}
              alt="Folder Open"
              width={50}
              height={50}
              className="filter invert flex-shrink-0"
              animate={{ width: expand ? 24 : 60, height: expand ? 24 : 60 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 120 }}

            />
               <span className="text-white font-medium text-base whitespace-nowrap truncate ">{folder.title}</span>
      </div>

      {/* Right side: grab handle */}
      <div className="cursor-grab text-gray-400 hover:text-white select-none">
        <span className="text-xl leading-none">⋮</span>
      </div>
    </motion.div>
  );
}

export default Folder_Render;
