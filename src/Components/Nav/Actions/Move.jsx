// hooks/useMoveLogic.ts

import { useFileStore } from '@/Zustand/File_Store';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

export const useMoveLogic = () => {
  const { moveFolder } = useFolderStore();
  const { draggingIndex, setDraggingIndex, dragOverIndex, setDragOverIndex } = useFileStore();
  const { handleUpdateFile } = useFileListLogic();
  const { handleUpdateFolder } = useFolderListLogic();

  const handleDrop = async ({ files, fileId = null, targetFolderId = null }) => {
    if (!fileId || !targetFolderId) return;


          await handleUpdateFile({
        id: fileId,
        folderId: targetFolderId,});
   
      // const sameFolderFiles = files
      //   .filter(f => f.folderId === targetFolderId);

      // const [movedFile] = sameFolderFiles.splice(draggingIndex, 1);
      // sameFolderFiles.splice(dragOverIndex, 0, movedFile);

      // setDraggingIndex(null);
      // setDragOverIndex(null);

      // for (let i = 0; i < sameFolderFiles.length; i++) {
      //   const updatedPos = i + 1;
      //   if (sameFolderFiles[i].filePosition !== updatedPos) {
      //     await handleUpdateFile({ id: sameFolderFiles[i].id, filePosition: updatedPos });
      //   }
      // }


  };
 

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

  return {
    handleDrop,
    folderDrop,
    draggingIndex,
    dragOverIndex,
    setDraggingIndex,
    setDragOverIndex,
    moveFolder,
  };
};
