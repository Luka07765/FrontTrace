import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Navigator/Tools/MoveLogic/Move';
import FileRender from '@/Components/Navigator/Tools/FileLogic/File_Render';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import CreateFolder from './FolderLogic/Create_Folder';
import Folder_Render from './FolderLogic/Folder_Render';
import { useFileStore } from '@/Zustand/File_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';


export const Basic = ({ folders }) => {
  const { expandedFolders, creatingFolderParentId } = useFolderStore();
      const {
    handleDrop,
    folderDrop,
    setDraggingIndex,
    setDragOverIndex,
    moveFolder,
  } = useMoveLogic();
  

  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const folderExpend = folder.children && folder.children.length > 0;
        const isCreatingChild = creatingFolderParentId === folder.id;
        const filesExpend = folder.files.length > 0;
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

                {filesExpend && (
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

                {folderExpend && (
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
