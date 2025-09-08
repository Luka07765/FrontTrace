import { useState } from 'react';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

export const RenameFolder = ({ folder }) => {
  const { setEditingFolderId, folderName, setFolderName } = useFolderStore();
  const { handleUpdateFolder } = useFolderListLogic();

  const [isExiting, setIsExiting] = useState(false); 

  const handleRename = (folderId) => {
    if (folderName.trim() !== '') {
      handleUpdateFolder({ id: folderId, title: folderName.trim() });
    }

    setIsExiting(true);

    setTimeout(() => {
      setEditingFolderId(null);
      setIsExiting(false);
    }, 1000);
  };

  return (
    <div className="relative bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none transition-transform duration-300 ease-in-out">
      <input
        className="bg-gray-800 text-white border-none focus:outline-none h-full pr-16 w-full"
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onBlur={() => handleRename(folder.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleRename(folder.id);
          } else if (e.key === 'Escape') {
            setIsExiting(true);
            setTimeout(() => {
              setEditingFolderId(null);
              setFolderName('');
              setIsExiting(false);
            }, 1000);
          }
        }}
        autoFocus
      />

      {isExiting && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-200 animate-pulse whitespace-nowrap">
          Saving...
        </span>
      )}
    </div>
  );
};

export default RenameFolder;
