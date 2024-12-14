import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Click } from '@/Zustand/Click_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { Select } from '@/Zustand/Select_Store';
import { handleCreate } from '@/Utils/Folder/FolderLogic';
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

    handleCreateFile,
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

  const handleCreateFileForFolder = (folderId) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      handleCreateFile({
        title: fileName,
        content: 'New File Content',
        folderId,
      });
    }
  };

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
          <li key={folder.id} className="relative">
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
                    <strong>{folder.title}</strong>

                    <button
                      onClick={() => {
                        handleCreateFileForFolder(folder.id);
                      }}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded"
                    >
                      + File
                    </button>
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
                    className={`bg-red-400 shadow-md rounded-lg p-4 flex justify-between  cursor-pointer ${
                      editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <span>{file.title}</span>
                    <span>{file.id}</span>
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
                <input
                  className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
                  type="text"
                  placeholder="New Folder"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onBlur={() => handleCreateWrapper(folder.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateWrapper(folder.id);
                    } else if (e.key === 'Escape') {
                      setCreatingFolderParentId(null);
                      setFolderName('');
                    }
                  }}
                  autoFocus
                />
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
