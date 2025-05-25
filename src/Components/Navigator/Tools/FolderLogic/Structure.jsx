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
import Warning from "@/assets/FolderFile_Icons/warning-sign.png"
function Structure({   folder,
  onDragEnterFolder,
  draggingFileId,onDragLeaveFolder,
  
  }) {
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


  const filesInTree = files.filter(file =>
    allFolderIds.includes(file.folderId)
  );


  const redCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'red' || '').length;
 
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

        onDragOver={(e) => e.preventDefault()}
  onDrop={() => {
    if (draggingFileId) {
      onDropFile(draggingFileId, folder.id);
    }
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
    setExpandedFolders(folder.id); 
  }}
  className="flex-grow"
>

        {isEditing ? (
          <RenameFolder folder={folder} />
        ) : (
          <>
            <div className="flex items-center space-x-3">
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
      width={11}
      height={11}
      className="absolute  translate-x-1/2 -translate-y-1/2"
    />
  )}

            {redCount > 0 && (


<div className="absolute  translate-x-1/2 -translate-y-1/"> {/* Container must be relative */}
<Image
  src={Bad}
  alt="Red Icon"
  width={11}
  height={11}
 className="translate-x -translate-y-1.5"
/>
<span className="text-red-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-3.5">
  {redCount}
</span>
</div>

)}

              {yellowCount > 0 && redCount === 0 && (
                
   <div className="absolute  translate-x-1/2 -translate-y-1/">
   <Image
     src={Warning}
     alt="Red Icon"
     width={11}
     height={11}
      className="translate-x -translate-y-1.5"
   />
   <span className='text-yellow-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-3.5' > {yellowCount}</span>
 </div>
)}
              {yellowCount > 0 && redCount > 0 &&  (
                
                <div className="absolute  translate-x-1/2 translate-y-1.5">
                <Image
                  src={Warning}
                  alt="Red Icon"
                  width={11}
                  height={11}
                />
                <span className='text-yellow-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-2' > {yellowCount}</span>
              </div>
             )}

                 <div
      onDragEnter={(e) => {
        e.preventDefault();
        if (onDragEnterFolder) onDragEnterFolder();
      }}
      onDragOver={(e) => e.preventDefault()} // needed to allow drop
      onDragLeave={(e) => {
        if (onDragLeaveFolder) onDragLeaveFolder();
      }}
      // other props and rendering
    >
      {/* render folder name, icon, etc */}
      {folder.title}
    </div>
              {/* <strong>{folder.id}</strong>           */}
          </div>

          </>
        )}
      </div>
    </div>
  );
}

export default Structure;
