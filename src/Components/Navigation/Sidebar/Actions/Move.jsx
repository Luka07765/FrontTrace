// hooks/useMoveLogic.ts

import { useFileStore } from '@/Zustand/File_Store';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import React, { useRef } from 'react';
export const useMoveLogic = (id) => {
  const { moveFolder ,setExpandedFolders,setMoveFolder} = useFolderStore();
  const { dragIdx, setDragIdx, dragOverIndex, setDragOverIndex } = useFileStore();
  const { handleUpdateFile } = useFileListLogic();
  const { handleUpdateFolder } = useFolderListLogic();
  const debounceTimer = useRef(null);
  const moveFile = useRef(null);
  const handleDrop = async ({ file,files, fileId = null, targetFolderId = null }) => {


    if (!fileId || !targetFolderId) return;

        
          await handleUpdateFile({
        id: fileId,
        folderId: targetFolderId,});
   
      // const sameFolderFiles = files
      //   .filter(f => f.folderId === targetFolderId);

      // const [movedFile] = sameFolderFiles.splice(dragIdx, 1);
      // sameFolderFiles.splice(dragOverIndex, 0, movedFile);

      // setDragIdx(null);
      // setDragOverIndex(null);

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

    setExpandedFolders(id);

    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
    }, 3000);
  };

    const moveFileToFolder = (e) => {
    e.preventDefault();

    if (moveFile.current) return; 

      setMoveFolder(id);
    moveFile.current = setTimeout(() => {
      moveFile.current = null;
    }, 500);
  };


  return {
    handleDrop,
    folderDrop,
    dragIdx,
    dragOverIndex,
    setDragIdx,
    setDragOverIndex,
    moveFolder,
    handleDragEnter,
    moveFileToFolder
  };
};
