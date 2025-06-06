import { useFolderStore } from '@/Zustand/Folder_Store';

import FileRender from '@/Components/Navigator/Tools/FileLogic/File_Render';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';
import Folder_Render from '@/Components/Navigator/Tools/FolderLogic/Folder_Render';
import { useFileStore } from '@/Zustand/File_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';


export const Basic = ({ folders }) => {
  const { expandedFolders, creatingFolderParentId,moveFolder } = useFolderStore();
    const {

      draggingIndex,setDraggingIndex,dragOverIndex,setDragOverIndex
  } = useFileStore();
  
  const { handleUpdateFile } = useFileListLogic();
  const { handleUpdateFolder } = useFolderListLogic();


const handleDrop = async ({ files, fileId = null, targetFolderId = null }) => {
  if (!fileId || !targetFolderId) return;

  const draggedFile = files.find(f => f.id === fileId);
  if (!draggedFile) return;

  const sourceFolderId = draggedFile.folderId;

  
  if (sourceFolderId === targetFolderId && draggingIndex !== null && dragOverIndex !== null) {
    const sameFolderFiles = files
      .filter(f => f.folderId === sourceFolderId)
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

  // Case 2: Moving to a different folder
  } else if (sourceFolderId !== targetFolderId) {
    await handleUpdateFile({
      id: fileId,
      folderId: targetFolderId,
    });
  }
};


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



  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const hasChildren = folder.children && folder.children.length > 0;
        const isCreatingChild = creatingFolderParentId === folder.id;

        return (
          <li
            key={folder.id}
            className={`relative ${
              isExpanded
                ? 'before:content-[""] before:absolute before:left-[15.70px] before:top-[38px] before:bottom-0 before:w-[0.750px] before:bg-gray-200'
                : ''
            }`}
          >
            <Folder_Render
  folder={folder}

    folderDrop={folderDrop} />

                
            {isExpanded && (
              <div>

                {folder.files.length > 0 && (
                  <ul className="ml-8">
                    {folder.files
                      .slice()
                      .sort((a, b) => a.filePosition - b.filePosition)
                      .map((file, index) => (
                        <FileRender
                          key={file.id}
                          file={file}
                       
                          index={index}
                          onDragStart={(i) => {
                            setDraggingIndex(i);
                          
                          }}
                          onDragEnter={(i) => setDragOverIndex(i)}
                          onDragEnd={() => handleDrop({ files: folder.files, fileId: file.id, targetFolderId: moveFolder })}

                      
                 
                        />
                      ))}
                  </ul>
                )}

                {hasChildren && (
                  <div className="ml-4">
                    <Basic folders={folder.children} />
                  </div>
                )}

                {isCreatingChild && (
                  <div className="ml-10">
                    <CreateFolder parentId={folder?.id} />
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}

      {creatingFolderParentId === null && (
        <li>
          <CreateFolder parentId={null} />
        </li>
      )}
    </ul>
  );
};
