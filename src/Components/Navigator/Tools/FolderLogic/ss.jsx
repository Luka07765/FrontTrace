import React, { useState } from 'react';
import { Click } from '@/Zustand/Click_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

export const RenameFolder = ({ folder }) => {
  const { setEditingFolderId, folderName, setFolderName } = Click();
  const { handleUpdateFolder } = useFolderListLogic();
  const [isSaving, setIsSaving] = useState(false);

  const handleRename = (folderId) => {
    if (folderName.trim() !== '') {
      setIsSaving(true);

      // Simulate a 2-second saving delay
      setTimeout(async () => {
        await handleUpdateFolder({ id: folderId, title: folderName.trim() });
        setIsSaving(false); // End saving state
        setEditingFolderId(null); // Exit editing mode after saving
      }, 2000);
    } else {
      setEditingFolderId(null); // Exit editing mode without saving
    }
  };

  return (
    <div>
      <input
        className={`bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none 
                     transition-transform duration-300 ease-in-out 
                    ${
                      isSaving
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:opacity-100 focus:scale-105'
                    }`}
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
        disabled={isSaving} // Prevent editing while saving
      />
      {isSaving && (
        <span className="ml-2 text-sm text-gray-500 animate-pulse">
          Saving...
        </span>
      )}
    </div>
  );
};

export default RenameFolder;
