import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Click } from '@/Zustand/Click_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { Select } from '@/Zustand/Select_Store';

import fileIcon from '@/assets/file.png';
import folderOpenIcon from '@/assets/open-folder.png';
import folderClosedIcon from '@/assets/folder.png';
import NestedFolder from '../Tools/FolderLogic/NestedFolder';
import RenameFolder from '../Tools/FolderLogic/RenameFolder';
export const FolderTree = ({ folders }) => {
  const {
    expandedFolders,
    setExpandedFolders,

    setContextMenuVisible,
    setContextMenuPosition,
    editingFolderId,

    creatingFolderParentId,
  } = Click();
  const { selectedFolderId, setSelectedFolderId } = Select();

  const {
    editFileId,
    setEditFileId,

    setFolderId,

    setEditFileName,

    setEditFileContent,
  } = useFileStore();
  const {
    files = [],

    handleDeleteFile,
  } = useFileListLogic();

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
                      <strong>{folder.title}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isExpanded && folderFiles(folder.id).length > 0 && (
              <ul className="ml-4">
                {folderFiles(folder.id).map((file) => (
                  <li
                    key={file.id}
                    onClick={(e) => {
                      setEditFileId(file.id);
                      e.stopPropagation();
                      setEditFileName(file.title);
                      setEditFileContent(file.content);
                      setFolderId(folder.id);
                    }}
                    className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
                      editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={fileIcon}
                        alt="File Icon"
                        width={20}
                        height={20}
                        className="filter invert"
                      />
                      <span className="text-left">{file.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {hasChildren && isExpanded && (
              <div className="ml-4">
                <FolderTree folders={folder.children} />
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
