import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useState } from 'react';
function FolderInput({ parentId }) {
  const { setCreatingFolderParentId, folderName, setFolderName } =
    useFolderStore();
  const { handleCreateFolder } = useFolderListLogic();
  const [isExiting, setIsExiting] = useState(false);

  const handleCreate = (parentFolderId) => {
    if (folderName.trim() !== '') {
      handleCreateFolder({ title: folderName.trim(), parentFolderId });
    }
    setCreatingFolderParentId(undefined); // Reset to undefined
    setFolderName('');
  };

  return (
    <div>
      <input
        className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
        type="text"
        placeholder="New Folder"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onBlur={() => handleCreate(parentId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCreate(parentId);
          } else if (e.key === 'Escape') {
            setCreatingFolderParentId(parentId === null ? undefined : null); // Handle both cases
            setFolderName('');
          }
        }}
        autoFocus
      />
    </div>
  );
}

export default FolderInput;
