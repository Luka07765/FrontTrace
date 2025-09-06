import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Nav/Actions/Move';
import FileRender from '@/app/log/main/FileAndFolder/File';

import CreateFolder from '@/Components/Nav/Actions/Create_Folder';
import Folder_Render from '@/app/log/main/FileAndFolder/Folder';


export const Main_Render = ({ folders }) => {
  const { expandedFolders, creatingFolderParentId } = useFolderStore();
      const {
    folderDrop,
  } = useMoveLogic();
  

  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];

        return (
          <li
            key={folder.id}
  
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
