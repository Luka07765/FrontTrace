// hooks/useMoveLogic.ts

import { useFileStore } from '@/Zustand/File_Store';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
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
   

      
const updatedData = [...moveData];
const fakeFile = fileMain


updatedData.splice(dragOver, 0, fakeFile);

// Update the state
setMoveData(updatedData);

console.table(updatedData);
setMoveData([]);

      setDragIdx(null);
      setDragOver(null);

      // for (let i = 0; i < sameFolderFiles.length; i++) {
      //   const updatedPos = i + 1;
      //   if (sameFolderFiles[i].filePosition !== updatedPos) {
      //     await handleUpdateFile({ id: sameFolderFiles[i].id, filePosition: updatedPos });
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
