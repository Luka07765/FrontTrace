import React from 'react';
import { Click } from '@/Zustand/Click_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { handleCreate } from '@/Utils/Folder/FolderLogic';

function Test({ folder }) {
  // Accept folder as a prop
  const { setCreatingFolderParentId, folderName, setFolderName } = Click();
  const { handleCreateFolder } = useFolderListLogic(); // Ensure this is initialized first

  const handleCreateWrapper = handleCreate({
    folderName,
    setCreatingFolderParentId,
    setFolderName,
    handleCreateFolder, // Now this is defined
  });

  return (
    <div>
      <input
        className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
        type="text"
        placeholder="New Folder"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onBlur={() => handleCreateWrapper(folder?.id)} // Use optional chaining to prevent undefined errors
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCreateWrapper(folder?.id); // Use optional chaining here as well
          } else if (e.key === 'Escape') {
            setCreatingFolderParentId(null);
            setFolderName('');
          }
        }}
        autoFocus
      />
    </div>
  );
}

export default Test;
