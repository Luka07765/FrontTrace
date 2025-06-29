import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextClick } from '@/Zustand/Context_Store';
import { useContextMenuActions } from './Actions';

export const ContextMenu = () => {
  const { contextMenuVisible, contextMenuPosition, setContextMenuVisible,contextMenuTarget } = ContextClick();
  const {
    selectedFolderId,
    renameFolder,
    createFolder,
    deleteFolder,
    createFileForFolder,
    deleteFile,

  } = useContextMenuActions();

  if (!contextMenuVisible) return null;

  const MENU_WIDTH = 200;   
  const MENU_HEIGHT = contextMenuTarget?.type === 'folder'? 240 : 120;


  let x = contextMenuPosition.x;
  let y = contextMenuPosition.y;

    if (x + MENU_WIDTH > window.innerWidth) {
    x = window.innerWidth - MENU_WIDTH - 20; 
  } else if (x < 0) {
    x = 10;
  }

  if (y + MENU_HEIGHT > window.innerHeight) {
    y = window.innerHeight - MENU_HEIGHT - 20; 
  } else if (y < 0) {
    y = 10; 
  }const isFolder = contextMenuTarget?.type === 'folder';
const isFile = contextMenuTarget?.type === 'file';

  return (
    <AnimatePresence>
      {contextMenuVisible && (
        <motion.ul
        
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          style={{        top: y,
        left: x,
        position: 'fixed',
        width: MENU_WIDTH, zIndex: 9999 }}
          className="bg-white shadow-lg rounded-xl border border-gray-200 w-48 text-gray-700 select-none"
          onClick={() => setContextMenuVisible(false)}
          
        >

          {isFolder && (
            <>              <li
            onClick={createFolder}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            📁Create Folder
          </li>

              <li
                onClick={renameFolder}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
               ✏️ Rename Folder
              </li>
              <li
                onClick={deleteFolder}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
               🗑️ Delete Folder
              </li>
              
            <hr className="p-1 border-t border-gray-200" /> {/* Separator line */}
              <li
                onClick={() => createFileForFolder(selectedFolderId)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
              📄 Create File
              </li>
            </>
          )}

          {isFile && (
               <li
            onClick={deleteFile}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
           ❌ Delete File
          </li>
 
)}

       

          


       


        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
