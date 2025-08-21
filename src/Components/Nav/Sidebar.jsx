import { useMemo, useState } from "react";

import { useFolderListLogic } from "@/Server/Apollo/Logic/SideBar/QuerySideBar";
import { useFileListLogic } from "@/Server/Apollo/Logic/Notes/QueryWorkTable";

import { Select } from "@/Zustand/Select_Store";
import { useContextMenuActions } from "@/app/notebook/main/tools/ContextMenu/Actions";

import { buildNestedStructure } from "@/Utils/Data_Structure/Structure";
import { Basic } from "./Tools/Basic_Render";
import CreateFolder from "@/Components/Nav/Tools/RenderLogic/Create_Folder";

import { findMatchingItems } from "@/Components/Nav/Tools/Search/Logic_Search";
import SearchResults from "@/Components/Nav/Tools/Search/Ui_Search";


export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
  const { files } = useFileListLogic();
  const { setSelectedFolderId } = Select();
  const { createFolder } = useContextMenuActions();

  const [searchTerm, setSearchTerm] = useState("");


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
    <div className="p-4 text-white">
      {/* Search Input */}
      <input
        placeholder="Search folders and files"
        type="text"
        className="px-3 py-2 rounded-lg bg-neutral-600/40 text-neutral-100 w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />

      {/* New Root Folder Button */}
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

      {/* Search Results */}
      <SearchResults
        searchTerm={searchTerm}
        matchingItems={matchingItems}
        setSelectedFolderId={setSelectedFolderId}
      />

      {/* Folder Tree */}
      {!searchTerm &&
        (nestedFolders ? (
          <Basic folders={nestedFolders} />
        ) : (
          <div>
            <p className="text-gray-500">Create New Folder.</p>
            <CreateFolder parentId={null} />
          </div>
        ))}
    </div>
  );
}
