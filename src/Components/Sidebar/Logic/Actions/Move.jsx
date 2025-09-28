// hooks/useMoveLogic.ts

import { useFileStore } from '@/Zustand/File_Store';
import { useFolderStore } from '@/Zustand/Old_Folder';
import { useFileListLogic } from '@/Server/GraphQl/Operations/Logic/File_Logic';
import { useFolderListLogic } from '@/Server/GraphQl/Operations/Logic/Folder_Logic';

import React, { useRef } from 'react';
export const useMoveLogic = (folder) => {
  const { moveFolder ,setExpandedFolders,setMoveFolder} = useFolderStore();
  const { dragIdx, setDragIdx, dragOver, setDragOver,moveData,setMoveData } = useFileStore();
  const { handleUpdateFile } = useFileListLogic();
  const { handleUpdateFolder } = useFolderListLogic();
  const debounceTimer = useRef(null);
  const moveFile = useRef(null);
  const handleDrop = async ({ files, fileId = null, targetFolderId = null,fileMain }) => {


    if (!fileId || !targetFolderId) return;

        
          await handleUpdateFile({
        id: fileId,
        folderId: targetFolderId,});
   

// Drugi Folder
// const updatedData = [...moveData];
// const fakeFile = fileMain


// updatedData.splice(dragOver, 0, fakeFile);

// // Update the state
// setMoveData(updatedData);

// console.table(updatedData);
// setMoveData([]);

//       setDragIdx(null);
//       setDragOver(null);

//      for (let i = 0; i < updatedData.length; i++) {
//   const updatedPos = i + 1; // backend expects 1-based indexing
//   const file = updatedData[i];

//   if (file.filePosition !== updatedPos) {
//     try {
//       await handleUpdateFile({ id: file.id, filePosition: updatedPos });
//       file.filePosition = updatedPos; // optional: update local object
//     } catch (err) {
//       console.error(`Error updating file ${file.id}:`, err);
//     }
//   }
// }


     
      // Isti folder   
      // const sameFolderFiles = files
      //   .filter(f => f.folderId === targetFolderId);

      // const [movedFile] = sameFolderFiles.splice(dragIdx, 1);
      // sameFolderFiles.splice(dragOver, 0, movedFile);

      // setDragIdx(null);
      // setDragOver(null);

      // for (let i = 0; i < updatedData.length; i++) {
      //   const updatedPos = i + 1;
      //   if (updatedData[i].filePosition !== updatedPos) {
      //     await handleUpdateFile({ id: updatedData[i].id, filePosition: updatedPos });
      //   }
      // }

  };
    

  const folderDrop = async ({ sourceFolderId, targetFolderId }) => {
      if (!sourceFolderId || !targetFolderId) {
    console.warn('Missing source or target folder ID.');
    return;
  }

  if (sourceFolderId === targetFolderId) {
    console.warn('Cannot move a folder into itself.');
    return;
  }

    if (
    !targetFolderId ||
    typeof targetFolderId !== 'string' ||
    targetFolderId.trim() === '' ||
    targetFolderId === 'null' ||
    targetFolderId === 'undefined'
  ) {
    setMoveFolder(null);
    return;
  }


    try {
    await handleUpdateFolder({
      id: sourceFolderId,
      parentFolderId: targetFolderId,
      
    });
  } catch (error) {
    console.error('Error moving folder:', error);
  }
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


  return {
    handleDrop,
    folderDrop,
    dragIdx,
    dragOver,
    setDragIdx,
    setDragOver,
    moveFolder,
    handleDragEnter,
    moveFileToFolder
  };
};
