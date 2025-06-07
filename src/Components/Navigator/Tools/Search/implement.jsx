import React, { useState, useMemo } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Basic } from './Tools/Basic_Render';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { Select } from '@/Zustand/Select_Store';
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';
import { useSearchFolders } from './useSearchFolders'; // your custom hook

export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
  const { setSelectedFolderId } = Select();
  const { files } = useFileListLogic();

  const [searchTerm, setSearchTerm] = useState('');

  const nestedFolders = useMemo(() => {
    return Array.isArray(folders) && folders.length > 0
      ? buildNestedStructure(folders, files)
      : null;
  }, [folders, files]);

  // Use your custom search hook
  const matchingItems = useSearchFolders(nestedFolders, searchTerm.toLowerCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading folders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading folders: {error.message}</p>
      </div>
    );
  }

  const handleParentClick = () => {
    setSelectedFolderId(null);
  };

  return (
    <div className="p-4 text-white" onClick={handleParentClick}>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search folders and files..."
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={(e) => e.stopPropagation()} // prevent deselect
      />

      {/* Render based on search term */}
      {searchTerm ? (
        matchingItems.length > 0 ? (
          <div>
            {/* Render your flat search results here */}
            {matchingItems.map((item) => (
              <div key={item.id} className="mb-2 p-2 bg-gray-800 rounded">
                <div>
                  <strong>{item.type === 'folder' ? '📁' : '📄'} {item.title || item.name}</strong>
                </div>
                <div className="text-sm text-gray-400">{item.breadcrumb}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No matching folders or files found.</p>
        )
      ) : nestedFolders ? (
        <Basic folders={nestedFolders} />
      ) : (
        <div>
          <p className="text-gray-500">Create New Folder.</p>
          <CreateFolder parentId={null} />
        </div>
      )}
    </div>
  );
}
