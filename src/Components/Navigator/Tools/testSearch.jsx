import React, { useState } from 'react';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useLogout } from '@/Server/Auth/Logout';
import { ContextMenu } from './Tools/Right_Click';
import { Basic } from './Tools/Basic_Render';
import { RightClick } from '@/Zustand/Context_Store';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { Select } from '@/Zustand/Select_Store';
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';

export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
  const { contextMenuVisible, setContextMenuVisible, setContextMenuPosition } =
    RightClick();
  const { setSelectedFolderId } = Select();
  const { handleLogout } = useLogout();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Recursive function to find matching items and their breadcrumbs
  const findMatchingItems = (items, query, breadcrumb = '') => {
    if (!items || !Array.isArray(items)) return [];

    let matches = [];

    items.forEach((item) => {
      if (!item) return;

      const currentBreadcrumb = breadcrumb
        ? `${breadcrumb} / ${item.title || 'Untitled'}`
        : item.title || 'Untitled';

      // Check if the folder or file matches the query
      if (item.title && item.title.toLowerCase().includes(query)) {
        matches.push({
          ...item,
          breadcrumb: currentBreadcrumb,
        });
      }

      // Search in children (subfolders)
      if (item.children && item.children.length > 0) {
        matches = matches.concat(
          findMatchingItems(item.children, query, currentBreadcrumb)
        );
      }

      // Search in files
      if (item.files && item.files.length > 0) {
        item.files.forEach((file) => {
          if (file.name && file.name.toLowerCase().includes(query)) {
            matches.push({
              ...file,
              breadcrumb: `${currentBreadcrumb} / ${file.name}`,
            });
          }
        });
      }
    });

    return matches;
  };

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

  const nestedFolders =
    Array.isArray(folders) && folders.length > 0
      ? buildNestedStructure(folders)
      : null;

  const matchingItems = searchTerm
    ? findMatchingItems(nestedFolders || [], searchTerm)
    : [];

  return (
    <div
      className="p-4 text-white"
      onClick={handleParentClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
      }}
    >
      <input
        placeholder="Search"
        type="text"
        className="px-3 py-2 tracking-wide rounded-lg bg-neutral-600/40 text-neutral-100 w-full mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Render search results */}
      {searchTerm && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Search Results</h3>
          {matchingItems.length > 0 ? (
            <ul>
              {matchingItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400">
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

      {/* Render full folder structure */}
      {nestedFolders ? (
        <Basic folders={nestedFolders} />
      ) : (
        <div>
          <p className="text-gray-500">Create New Folder.</p>
          <CreateFolder parentId={null} />
        </div>
      )}

      {contextMenuVisible && <ContextMenu />}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
}
