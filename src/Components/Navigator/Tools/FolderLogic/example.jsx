import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useFolderStore } from '@/Zustand/Folder_Store';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import folderClosedIcon from '@/assets/FolderFile_Icons/folder.png';
import { RightClick } from '@/Zustand/Context_Store';
import RenameFolder from '@/Components/Navigator/Tools/FolderLogic/RenameFolder';
import { Select } from '@/Zustand/Select_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
function ExampleD({ folder }) {
  const { setContextMenuPosition, setContextMenuVisible } = RightClick();
  const { selectedFolderId, setSelectedFolderId } = Select();
  const {
    expandedFolders,
    setExpandedFolders,

    editingFolderId,

    creatingFolderParentId,
  } = useFolderStore();
  const isExpanded = expandedFolders[folder.id];
  const hasChildren = folder.children && folder.children.length > 0;
  const isEditing = editingFolderId === folder.id;
  const isCreatingChild = creatingFolderParentId === folder.id;

  const { files = [] } = useFileListLogic();
  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);
  return (
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
        <span onClick={() => setExpandedFolders(folder.id)} className="mr-1">
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
  );
}

export default ExampleD;
