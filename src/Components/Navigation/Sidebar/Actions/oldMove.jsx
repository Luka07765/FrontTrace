// hooks/useMoveLogic.ts

import { useFileStore } from '@/Zustand/File_Store';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';

export const useMoveLogic = (folder) => {
  const { moveFolder } = useFolderStore();
  const { dragIdx, setDragIdx, dragOver, setDragOver } = useFileStore();
  const { handleUpdateFile } = useFileListLogic();

  const handleDrop = async ({ files, fileId = null, targetFolderId = null }) => {


    if (!fileId || !targetFolderId) return;

        
 
        
      const sameFolderFiles = files
        .filter(f => f.folderId === targetFolderId);

      const [movedFile] = sameFolderFiles.splice(dragIdx, 1);
      sameFolderFiles.splice(dragOver, 0, movedFile);

      setDragIdx(null);
      setDragOver(null);

      for (let i = 0; i < updatedData.length; i++) {
        const updatedPos = i + 1;
        if (updatedData[i].filePosition !== updatedPos) {
          await handleUpdateFile({ id: updatedData[i].id, filePosition: updatedPos });
        }
      }


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
