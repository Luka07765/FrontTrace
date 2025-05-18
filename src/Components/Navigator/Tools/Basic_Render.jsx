import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';

import FileRender from '@/Components/Navigator/Tools/FileLogic/File_Render';

import CreateFolder from './FolderLogic/Create_Folder';
import Structure from './FolderLogic/Structure';

export const Basic = ({ folders }) => {
  const { expandedFolders, creatingFolderParentId } = useFolderStore();

  const { files = [] } = useFileListLogic();

  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);

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
            <Structure folder={folder} />
            {/* FILES */}

                   {/* {isExpanded && folder.files.length > 0 && (
  <ul className="ml-8">
    {folder.files.map((file, index) => (
      <FileRender key={file.id} file={file} index={index} />
    ))}
  </ul> */}
            {isExpanded && folderFiles(folder.id).length > 0 && (
              <ul className="ml-8">
                {folderFiles(folder.id).map((file,index) => (
                  <FileRender key={file.id} file={file}  index={index} />
                ))}
              </ul>
            )}
            {hasChildren && isExpanded && (
              <div className="ml-4">
                <Basic folders={folder.children} />
              </div>
            )}
            {isCreatingChild && (
              <div className="ml-10">
                <CreateFolder parentId={folder?.id} />
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
