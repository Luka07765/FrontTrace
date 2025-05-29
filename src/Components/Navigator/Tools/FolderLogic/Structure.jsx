import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useFolderStore } from '@/Zustand/Folder_Store';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import folderClosedIcon from '@/assets/FolderFile_Icons/folder.png';
import { RightClick } from '@/Zustand/Context_Store';
import RenameFolder from '@/Components/Navigator/Tools/FolderLogic/Rename_Folder';
import { Select } from '@/Zustand/Select_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import Bad from "@/assets/FolderFile_Icons/unlike.png"
import checked from "@/assets/FolderFile_Icons/checked.png";
import Warning from "@/assets/FolderFile_Icons/warning-sign.png"
import React, { useRef,useEffect } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';


import { motion, AnimatePresence } from 'framer-motion';
function Structure({   folder
  }) {
  const { setContextMenuPosition, setContextMenuVisible } = RightClick();
  const { selectedFolderId, setSelectedFolderId } = Select();
  const {
    expandedFolders,
    setExpandedFolders,
   setMoveFolder,moveFolder,
    editingFolderId,setDragFolder,dragFolder
  } = useFolderStore();
  const isExpanded = expandedFolders[folder.id];
  const hasChildren = folder.children && folder.children.length > 0;
  const isEditing = editingFolderId === folder.id;
   const debounceTimer = useRef(null);
   const moveFile = useRef(null);


  const { files = [] } = useFileListLogic();
  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);

  const getAllDescendantIds = (f) => {
    let ids = [f.id];
    if (f.children) {
      f.children.forEach(child => {
        ids = ids.concat(getAllDescendantIds(child));
      });
    }
    return ids;
  };
  const allFolderIds = getAllDescendantIds(folder);


  const filesInTree = files.filter(file =>
    allFolderIds.includes(file.folderId)
  );

  const { handleUpdateFolder } = useFolderListLogic();
  const redCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'red' || '').length;
 
  const yellowCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'yellow' || '').length;
  

  const safeMoveFolder = async ({
  dragFolder,
  moveFolder,
  folders,
}) => {
  if (!dragFolder || !moveFolder) {
    console.warn('Missing source or target folder ID.');
    return;
  }

  if (dragFolder === moveFolder) {
    console.warn('Cannot move a folder into itself.');
    return;
  }

  const source = folders.find(f => f.id === dragFolder);
  const target = folders.find(f => f.id === moveFolder);

  if (!source) {
    console.warn('Source folder not found.');
    return;
  }

  if (!target) {
    console.warn('Target folder not found.');
    return;
  }

  if (source.parentFolderId === moveFolder) {
    console.log('Folder already in target — no update needed.');
    return;
  }

  // Prevent circular reference: dragFolder shouldn't be moved into its descendant
  const isDescendant = (targetId, currentId) => {
    const current = folders.find(f => f.id === currentId);
    if (!current || !current.parentFolderId) return false;
    if (current.parentFolderId === targetId) return true;
    return isDescendant(targetId, current.parentFolderId);
  };

  if (isDescendant(dragFolder, moveFolder)) {
    console.warn('Cannot move folder into its own descendant.');
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
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
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
          {(redCount === 0 && yellowCount === 0) && (
    <Image
      src={checked}
      alt="Checked Icon"
      width={11}
      height={11}
      className="absolute  translate-x-1/2 -translate-y-1/2"
    />
  )}

            {redCount > 0 && (


<motion.div                 initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }} className="absolute  translate-x-1/2 -translate-y-1/"> 

<Image
  src={Bad}
  alt="Red Icon"
  width={11}
  height={11}
 className="translate-x -translate-y-1.5"
/>
<span className="text-red-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-3.5">
  {redCount}
</span>
</motion.div>

)}

              {yellowCount > 0 && redCount === 0 && (
                
   <motion.div      initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }} className="absolute  translate-x-1/2 -translate-y-1/">
   <Image
     src={Warning}
     alt="Red Icon"
     width={11}
     height={11}
      className="translate-x -translate-y-1.5"
   />
   <span className='text-yellow-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-3.5' > {yellowCount}</span>
 </motion.div>
)}
              {yellowCount > 0 && redCount > 0 &&  (
                
                                <motion.div 
                  className="absolute translate-x-1/2 -translate-y-1/"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >

                <Image
                  src={Warning}
                  alt="Red Icon"
                  width={11}
                  height={11}
                />
                <span className='text-yellow-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-2' > {yellowCount}</span>
              </motion.div>
             )}

                 <div
                       draggable

   onDragStart={() => {
  setDragFolder(folder.id);
}}

  onDragEnd={() => {
  safeMoveFolder({
    dragFolder,
    moveFolder,
    folders, 
  });
}}

      
    >

      {folder.title}
    </div>
    
          </div>

          </>
        )}
      </div>
    </motion.div>
  );
}

export default Structure;
