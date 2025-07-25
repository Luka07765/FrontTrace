import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Basic } from './Tools/Basic_Render';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { Select } from '@/Zustand/Select_Store';
import {useMemo,useState} from "react";
import { useContextMenuActions } from './Tools/ContextMenu/Actions';
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';

export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
    const { files } = useFileListLogic();
      const { setSelectedFolderId } = Select();
  const {
    createFolder,
  } = useContextMenuActions();
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

const findMatchingItems = (items, query, breadcrumb = '') => {
  if (!items || !Array.isArray(items)) return [];

  let matches = [];

  items.forEach((item) => {
    if (!item) return;

    const currentBreadcrumb = breadcrumb
      ? `${breadcrumb} / ${item.title || 'Untitled'}`
      : item.title || 'Untitled';

    // Check folders
    if (item.title && item.title.toLowerCase().includes(query)) {
      matches.push({
        ...item,
        breadcrumb: currentBreadcrumb,
        type: 'folder'
      });
    }

    // Check files under this folder (if they exist)
    if (item.files && Array.isArray(item.files)) {
      item.files.forEach((file) => {
        if (file.title && file.title.toLowerCase().includes(query)) {
          matches.push({
            ...file,
            breadcrumb: `${currentBreadcrumb} / ${file.title}`,
            type: 'file'
          });
        }
      });
    }

    // Recursively search subfolders
    if (item.children && item.children.length > 0) {
      matches = matches.concat(
        findMatchingItems(item.children, query, currentBreadcrumb)
      );
    }
  });

  return matches;
};


   const nestedFolders = useMemo(() => {
    return Array.isArray(folders) && folders.length > 0
      ? buildNestedStructure(folders, files)
      : null;
  }, [folders, files]);
  const matchingItems = searchTerm
    ? findMatchingItems(nestedFolders || [], searchTerm)
    : [];
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



  return (
    <div
      className=" p-4 text-white "

    >      <input
        placeholder="Search folders and files"
        type="text"
        className="px-3 py-2 rounded-lg bg-neutral-600/40 text-neutral-100 w-full mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />
            <button
          onClick={(e) => {
    e.stopPropagation(); 
    setSelectedFolderId(null); 
    createFolder(); 
  }}
        className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition duration-200 ease-in-out mb-4"
      >
        + New Root Folder
      </button>


            {searchTerm && (
  <div className="mb-4">
    <h3 className="text-lg font-bold mb-2">Search Results</h3>
    {matchingItems.length > 0 ? (
      <ul>
        {matchingItems.map((item) => (
          <li 
            key={item.id} 
            className="mb-2 p-2 hover:bg-neutral-700/40 rounded cursor-pointer"
            onClick={() => {
              if (item.type === 'folder') {
                setSelectedFolderId(item.id);
              } else {
                // Handle file selection logic here
                console.log("Selected file:", item.id);
              }
            }}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {item.type === 'folder' ? '📁' : '📄'}
              </span>
              <span className="text-sm">
                {item.breadcrumb}
              </span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No results found.</p>
    )}
  </div>
)}

          {!searchTerm && (
        nestedFolders ? (
          <Basic folders={nestedFolders} />
        ) : (
          <div>
            <p className="text-gray-500">Create New Folder.</p>
            <CreateFolder parentId={null} />
          </div>
        )
      )}
    </div>
  );
}
