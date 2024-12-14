import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Click } from '@/Zustand/Click_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { Select } from '@/Zustand/Select_Store';
import { handleCreate } from '@/Utils/Folder/FolderLogic';
import fileIcon from '@/assets/file.png';
import folderOpenIcon from '@/assets/open-folder.png';
import folderClosedIcon from '@/assets/folder.png';
import Test from '../Test';
export const FolderTree = ({ folders }) => {
  const {
    expandedFolders,
    setExpandedFolders,

    setContextMenuVisible,
    setContextMenuPosition,
    editingFolderId,
    setEditingFolderId,
    creatingFolderParentId,
    setCreatingFolderParentId,
    folderName,
    setFolderName,
  } = Click();
  const { selectedFolderId, setSelectedFolderId } = Select();
  const { handleCreateFolder, handleUpdateFolder } = useFolderListLogic();
  const {
    editFileId,
    setEditFileId,

    folderId,
    setFolderId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
    resetEditState,
  } = useFileStore();
  const {
    files = [],

    handleDeleteFile,
  } = useFileListLogic();

  const handleSubmitUpdate = () => {
    handleUpdateFile({
      id: editFileId,
      title: editFileName,
      content: editFileContent,
      folderId,
    });
    resetEditState();
  };

  const handleRename = (folderId) => {
    if (folderName.trim() !== '') {
      handleUpdateFolder({ id: folderId, title: folderName.trim() });
    }

    setEditingFolderId(null);
  };

  const handleCreateWrapper = handleCreate({
    folderName,
    setCreatingFolderParentId,
    setFolderName,
    handleCreateFolder,
  });

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
                ? 'before:content-[""] before:absolute before:left-[15.590px] before:top-[38px] before:bottom-0 before:w-[0.750px] before:bg-gray-200'
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
                <span className="mr-4" /> // Empty space for alignment
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
                  // Render input for in-line editing
                  <input
                    className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={() => handleRename(folder.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRename(folder.id);
                      } else if (e.key === 'Escape') {
                        setEditingFolderId(null);
                        setFolderName('');
                      }
                    }}
                    autoFocus
                  />
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
                    {/* Left section: Image and title */}
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

                    {/* Right section: Delete button */}
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-100 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Render children recursively if expanded */}
            {hasChildren && isExpanded && (
              <div className="ml-4">
                <FolderTree folders={folder.children} />
              </div>
            )}

            {/* In-line folder creation */}
            {isCreatingChild && (
              <div className="ml-10">
                <Test folder={folder} />
              </div>
            )}
          </li>
        );
      })}

      {creatingFolderParentId === null && (
        <li>
          <input
            className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
            type="text"
            placeholder="New Folder"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onBlur={() => handleCreateWrapper(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateWrapper(null);
              } else if (e.key === 'Escape') {
                setCreatingFolderParentId(undefined); // Reset to undefined
                setFolderName('');
              }
            }}
            autoFocus
          />
        </li>
      )}
    </ul>
  );
};
