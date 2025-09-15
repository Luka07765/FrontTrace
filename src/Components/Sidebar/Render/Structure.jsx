import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Sidebar/Actions/Move';


import CreateFolder from '@/Components/Sidebar/Actions/Create_Folder';
import Folder_Render from '@/Components/Sidebar/Render/Folder';


export const Main_Render = ({ folders }) => {
  const { creatingFolderParentId } = useFolderStore();
      const {
    folderDrop,
  } = useMoveLogic();
  

  return (
    <ul>
      {folders.map((folder) => {


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
