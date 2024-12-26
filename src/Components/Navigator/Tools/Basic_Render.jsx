import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import ExampleD from './FolderLogic/example';
import { Select } from '@/Zustand/Select_Store';

import Example from '@/Components/Navigator/Tools/FileLogic/example';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import folderClosedIcon from '@/assets/FolderFile_Icons/folder.png';
import NestedFolder from '../Tools/FolderLogic/NestedFolder';
import RenameFolder from '../Tools/FolderLogic/RenameFolder';
import { RightClick } from '@/Zustand/Context_Store';
export const Basic = ({ folders }) => {
  const {
    expandedFolders,
    setExpandedFolders,

    editingFolderId,

    creatingFolderParentId,
  } = useFolderStore();

  const { files = [] } = useFileListLogic();

  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);

  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const hasChildren = folder.children && folder.children.length > 0;
        const isEditing = editingFolderId === folder.id;
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
            <ExampleD folder={folder} />
            {/* FILES */}
            {isExpanded && folderFiles(folder.id).length > 0 && (
              <ul className="ml-4">
                {folderFiles(folder.id).map((file) => (
                  <Example key={file.id} folder={folder} file={file} />
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
                <NestedFolder parentId={folder?.id} />
              </div>
            )}
          </li>
        );
      })}

      {creatingFolderParentId === null && (
        <li>
          <NestedFolder parentId={null} />
        </li>
      )}
    </ul>
  );
};
