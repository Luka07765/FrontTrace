import Image from 'next/image';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useFolderStore } from '@/Zustand/Folder_Store';
import folderOpenIcon from '@/assets/FolderFile_Icons/open-folder.png';
import folderClosedIcon from '@/assets/FolderFile_Icons/folder.png';
import { RightClick } from '@/Zustand/Context_Store';
import RenameFolder from '@/Components/Navigator/Tools/FolderLogic/Rename_Folder';
import { Select } from '@/Zustand/Select_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import Bad from "@/assets/FolderFile_Icons/unlike.png"
import checked from "@/assets/FolderFile_Icons/checked.png";
import Warning from "@/assets/FolderFile_Icons/warning.png"
function Structure({ folder }) {
  const { setContextMenuPosition, setContextMenuVisible } = RightClick();
  const { selectedFolderId, setSelectedFolderId } = Select();
  const {
    expandedFolders,
    setExpandedFolders,

    editingFolderId,
  } = useFolderStore();
  const isExpanded = expandedFolders[folder.id];
  const hasChildren = folder.children && folder.children.length > 0;
  const isEditing = editingFolderId === folder.id;

  const { files = [] } = useFileListLogic();
  const folderFiles = (folderId) =>
    files.filter((file) => file.folderId === folderId);

  const getAllDescendantIds = (f) => {
    let ids = [f.id];
    if (f.children) {
      f.children.forEach(child => {
        ids = ids.concat(getAllDescendantIds(child));
      });
    }
    return ids;
  };
  const allFolderIds = getAllDescendantIds(folder);

  // 2) Filtriraj sve fajlove koji spadaju u tu hijerarhiju
  const filesInTree = files.filter(file =>
    allFolderIds.includes(file.folderId)
  );

  // 3) Brojanje po bojama
  const redCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'red' || '').length;
  const greenCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'green' || '').length;
  const yellowCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'yellow' || '').length;
  
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
          {(redCount === 0 && yellowCount === 0) && (
    <Image
      src={checked}
      alt="Checked Icon"
      width={13}
      height={13}
      className="absolute  translate-x-1/2 -translate-y-1/2"
    />
  )}

            {redCount > 0 && (
   <div className="absolute top-3 flex items-center space-x-1 text-xs text-red-500">
   <Image
     src={Bad}
     alt="Red Icon"
     width={13}
     height={13}
   />
   <span>{redCount}</span>
 </div>
)}

              {yellowCount > 0 && (
   <div className="absolute top-1 flex items-center space-x-1 text-xs text-yellow-500">
   <Image
     src={Warning}
     alt="Red Icon"
     width={13}
     height={13}
   />
   <span > {yellowCount}</span>
 </div>
)}

              <strong className="text-left">{folder.title}</strong>
              <div className="flex space-x-4 text-sm ml-6 mt-1">
                
 
  
          
          </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Structure;
