import { useMemo, useState } from "react";

import { useFolderListLogic } from "@/Server/Apollo/Logic/SideBar/QuerySideBar";
import { useFileListLogic } from "@/Server/Apollo/Logic/Notes/QueryWorkTable";

import { useSelectStore } from "@/Zustand/Select_Store";
import { useContextMenuActions } from "@/Components/Nav/Tools/Ui/ContextMenu/Actions";

import { buildNestedStructure } from "@/Utils/Data_Structure/Structure";
import { Main_Render } from "@/Components/Nav/Render/Main_Render";
import CreateFolder from "@/Components/Nav/Tools/Logic/Actions/Create_Folder";

import { findMatchingItems } from "@/Components/Nav/Tools/Logic/Search/Logic_Search";
import SearchResults from "@/Components/Nav/Tools/Logic/Search/Ui_Search";


export default function FolderList({nestedFolders}) {

  const { setSelectedFolderId } = useSelectStore();
  const { createFolder } = useContextMenuActions();

  const [searchTerm, setSearchTerm] = useState("");




  const matchingItems = searchTerm
    ? findMatchingItems(nestedFolders || [], searchTerm)
    : [];



  return (
    <div className="p-4 text-white overflow-auto">
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


      {!searchTerm &&
        (nestedFolders ? (
          <Main_Render folders={nestedFolders} />
        ) : (
          <div>
            <p className="text-gray-500">Create New Folder.</p>
            <CreateFolder parentId={null} />
          </div>
        ))}
    </div>
  );
}
