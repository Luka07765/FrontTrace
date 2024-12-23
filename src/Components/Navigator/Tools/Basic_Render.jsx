import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { Select } from '@/Zustand/Select_Store';

import Example from '@/Components/Navigator/Tools/FileLogic/example';
import folderOpenIcon from '@/assets/open-folder.png';
import folderClosedIcon from '@/assets/folder.png';
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
  const { setContextMenuPosition, setContextMenuVisible } = RightClick();
  const { selectedFolderId, setSelectedFolderId } = Select();

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
            <div
              className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-600 ${
                selectedFolderId === folder.id ? 'border-2 border-blue-500' : ''
              }`}
              onContextMenu={(e) => {
                e.preventDefault();

                setSelectedFolderId(folder.id);

                setContextMenuVisible(true);
                setContextMenuPosition({ x: e.pageX, y: e.pageY });
              }}
            >
              {/* Expand/Collapse Icon */}
              {hasChildren || folderFiles(folder.id).length > 0 ? (
                <span
                  onClick={() => setExpandedFolders(folder.id)}
                  className="mr-1"
                >
                  {' '}
                  {isExpanded ? (
                    <FaChevronDown className="inline" />
                  ) : (
                    <FaChevronRight className="inline" />
                  )}
                </span>
              ) : (
                <span className="mr-4" />
              )}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFolderId(
                    selectedFolderId === folder.id ? null : folder.id
                  );
                }}
                className="flex-grow"
              >
                {isEditing ? (
                  <RenameFolder folder={folder} />
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={isExpanded ? folderOpenIcon : folderClosedIcon} // Dynamic folder image
                        alt={isExpanded ? 'Folder Open' : 'Folder Closed'}
                        width={20}
                        height={20}
                        className="filter invert"
                      />
                      <strong className="text-left">{folder.title}</strong>
                      <strong className="text-left">
                        {'p ' + folder.parentFolderId}
                      </strong>
                      <strong className="text-left">{'id' + folder.id}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>

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
