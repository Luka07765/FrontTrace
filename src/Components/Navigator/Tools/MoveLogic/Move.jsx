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

   
      const sameFolderFiles = files
        .filter(f => f.folderId === targetFolderId)
        .sort((a, b) => a.filePosition - b.filePosition);

      const [movedFile] = sameFolderFiles.splice(draggingIndex, 1);
      sameFolderFiles.splice(dragOverIndex, 0, movedFile);

      setDraggingIndex(null);
      setDragOverIndex(null);

      for (let i = 0; i < sameFolderFiles.length; i++) {
        const updatedPos = i + 1;
        if (sameFolderFiles[i].filePosition !== updatedPos) {
          await handleUpdateFile({ id: sameFolderFiles[i].id, filePosition: updatedPos });
        }
      }


  };
 
      // await handleUpdateFile({
      //   id: fileId,
      //   folderId: targetFolderId,
  const folderDrop = async ({ folderId, targetFolderId }) => {
    if (!folderId || !targetFolderId || folderId === targetFolderId) return;

    try {
      await handleUpdateFolder({
        id: folderId,
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
