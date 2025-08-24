import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Nav/Tools/Logic/MoveLogic/Move';
import FileRender from '@/Components/Nav/Render/FileAndFolder/File';

import CreateFolder from '@/Components/Nav/Tools/Logic/Actions/Create_Folder';
import Folder_Render from '@/Components/Nav/Render/FileAndFolder/Folder';


export const Main_Render = ({ folders }) => {
  const { expandedFolders, creatingFolderParentId } = useFolderStore();
      const {
    folderDrop,
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
