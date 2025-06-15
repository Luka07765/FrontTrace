import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useFolderStore } from '@/Zustand/Folder_Store';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import folderClosedIcon from '@/assets/FolderFile_Icons/folder.png';
import { ContextClick } from '@/Zustand/Context_Store';
import RenameFolder from '@/Components/Navigator/Tools/FolderLogic/Rename_Folder';
import { Select } from '@/Zustand/Select_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';

import React, { useRef } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFolderColors } from './Colors/ColorLogic';
import UiColors from './Colors/UiColors';

import { motion } from 'framer-motion';
function Folder_Render({   folder
  }) {
      // const [showMainFolderPopup, setShowMainFolderPopup]  = useState(false);
  const { setContextMenuPosition, setContextMenuVisible ,setContextMenuTarget} = ContextClick();
  const { selectedFolderId, setSelectedFolderId } = Select();
  const {
    expandedFolders,
    setExpandedFolders,
   setMoveFolder,moveFolder,
    editingFolderId,setDragFolder,dragFolder,setNullExpend,    nullExpend, popupFolder,setPopupFolder
  } = useFolderStore();
  const isExpanded = expandedFolders[folder.id];
  const hasChildren = folder.children && folder.children.length > 0;
  const isEditing = editingFolderId === folder.id;
   const debounceTimer = useRef(null);
   const moveFile = useRef(null);

  const { files = [] } = useFileListLogic();
  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);

const { redCount, yellowCount } = useFolderColors(folder);





  const { handleUpdateFolder } = useFolderListLogic();

  const safeMoveFolder = async ({
  dragFolder,
  moveFolder,
 
}) => {
  if (!dragFolder || !moveFolder) {
    console.warn('Missing source or target folder ID.');
    return;
  }

  if (dragFolder === moveFolder) {
    console.warn('Cannot move a folder into itself.');
    return;
  }

  if (
  !moveFolder ||                               // null, undefined, 0, false
  typeof moveFolder !== 'string' ||            // numbers, objects, arrays, etc.
  moveFolder.trim() === '' ||                  // empty string or whitespace
  moveFolder === 'null' ||                     // string literal "null"
  moveFolder === 'undefined'                   // string literal "undefined"
) {

  moveFolder = null;
  return;
}



  await handleUpdateFolder({
    id: dragFolder,
    parentFolderId: moveFolder,
  });
 
};


  const handleDragEnter = (e) => {
    e.preventDefault();

    if (debounceTimer.current) return; 

    setExpandedFolders(folder.id);

    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
    }, 3000);
  };

    const moveFileToFolder = (e) => {
    e.preventDefault();

    if (moveFile.current) return; 

      setMoveFolder(folder.id);
    moveFile.current = setTimeout(() => {
      moveFile.current = null;
    }, 500);
  };


  const folderIconVariants = {
    expanded: { scale: 1.1, rotate: 5 },
    collapsed: { scale: 1, rotate: 0 }
  };




  return (
    <motion.div
      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-600 ${
        selectedFolderId === folder.id ? 'border-2 border-blue-500' : ''
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        setSelectedFolderId(folder.id);
        setContextMenuVisible(true);
        setContextMenuTarget({ type: 'folder'});
        setContextMenuPosition({ x: e.pageX, y: e.pageY -100 });
      }}

        onDragOver={(e) => e.preventDefault()}

      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
 
    >


      {hasChildren || folderFiles(folder.id).length > 0 ? (
         <span    onDragEnter={handleDragEnter} onClick={() => setExpandedFolders(folder.id)} className="mr-1">
      
          {isExpanded ? (
            <FaChevronDown className="inline" />
          ) : (
            <FaChevronRight className="inline" />
          )}
        </span>
      ) : (
        <span className="mr-4" />
      )}

  <div
  onClick={(e) => {
    e.stopPropagation();
        if (folder.parentFolderId === null || folder.parentFolderId === 'None') {
    setNullExpend(true);
    setPopupFolder(folder); 
    return; 
  }
    setSelectedFolderId(
      selectedFolderId === folder.id ? null : folder.id
    );
    setExpandedFolders(folder.id);
  
  }}

  className="flex-grow"
>

        {isEditing ? (
          <RenameFolder folder={folder} />
        ) : (
          <>
            <div  onDragEnter={moveFileToFolder}
         className="flex items-center space-x-3">
                 <motion.div
                variants={folderIconVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ duration: 0.4 }}
              >
              <Image
                src={isExpanded ? folderOpenIcon : folderClosedIcon} // Dynamic folder image
                alt={isExpanded ? 'Folder Open' : 'Folder Closed'}
                width={20}
                height={20}
                className="filter invert"
              />
              </motion.div>

<UiColors redCount={redCount} yellowCount={yellowCount} />



                 <div className="flex items-center space-x-1">
    <div className="ml-1">
    {folder.title}
  </div>
  <div
    draggable
    onDragStart={() => setDragFolder(folder.id)}
    onDragEnd={() =>{
           safeMoveFolder({
        dragFolder,
        moveFolder,
      })
      setMoveFolder(null)
      

    }
 
    }
    title="Drag to move folder"
    className="cursor-grab text-gray-300 hover:text-white"
  >
    <span className="text-xl leading-none select-none">⋮</span> 
  </div>


</div>    
          </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Folder_Render;
