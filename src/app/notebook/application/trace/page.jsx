'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from "react";

// Context and State Management
import { ContextClick } from '@/Zustand/Context_Store';
import { useSelectStore } from "@/Zustand/Select_Store"
import {IconPickerModal} from "@/Components/Sidebar/Ui/U_Icons/IconUi"
// Server and Authentication
import { useToken } from '@/Server/Auth/Token';
import { useAuthCheck } from '@/Server/Auth/Auth-Check';

// Data Logic
import { useFolderListLogic } from "@/Server/Apollo/Logic/SideBar/QuerySideBar";
import { useFileListLogic } from "@/Server/Apollo/Logic/Notes/QueryWorkTable";
import { buildNestedStructure } from "@/Utils/Data_Structure/Structure";
import { findMatchingItems } from "@/Components/Sidebar/Logic/L_Search/Logic_Search";
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Sidebar/Actions/Move';



import Folder_Render from '@/Components/Sidebar/Render/Folder';


// UI Components
import File from '@/Components/Work_Space/WorkPage';
import NullSidebar from '@/Components/Sidebar/Ui/U_Null/UiNull';
import SearchResults from "@/Components/Sidebar/Ui/U_Search/Ui_Search";
import CreateFolder from "@/Components/Sidebar/Actions/Create_Folder";
import ContextMenu from '@/Components/Sidebar/Ui/U_ContextMenu/Context_Ui';


// Hooks and Utilities
import useResizable from '@/Components/Sidebar/Actions/Resize-Bar';
import { useContextMenuActions } from "@/Components/Sidebar/Logic/L_Context/Actions";

export default function Dashboard() {
   const { creatingFolderParentId } = useFolderStore();
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Context and Store
  const { setContextMenuVisible } = ContextClick();
  const { setSelectedFolderId } = useSelectStore();
  
  // Data Fetching
  const { folders, loading, error } = useFolderListLogic();
  const { files } = useFileListLogic();
  
  // Hooks
  const { contentRef } = useResizable();  
  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);
  const { createFolder } = useContextMenuActions();
        const {
    folderDrop,
  } = useMoveLogic();
  // Derived Data
  const nestedFolders = useMemo(() => {
    return Array.isArray(folders) && folders.length > 0
      ? buildNestedStructure(folders, files)
      : null;
  }, [folders, files]);
  
  const matchingItems = searchTerm
    ? findMatchingItems(nestedFolders || [], searchTerm)
    : [];

  // Loading States
  if (loadingAuth) return <p>Loading...</p>;
  
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
    <motion.div
      className="relative flex h-screen overflow-hidden "
      onClick={() => setContextMenuVisible(false)}
    >
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? '5rem' : '16rem' }}
        transition={{ type: 'spring', damping: 15 }}
        className="overflow-auto h-full bg-gray-900 text-white flex flex-col  items-center py-4"
      >
        {/* Search Input */}
        <input
          placeholder="Search folders and files"
          type="text"
          className="px-3 py-2 rounded-lg bg-neutral-600/40 text-neutral-100 w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          {collapsed ? '▶' : '◀'}
        </button>
        
        {/* Create Folder Button */}
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
        />
        
        {/* Context Menu */}
        <ContextMenu />
        
        {/* Folder Structure */}
        {!searchTerm &&
          (nestedFolders ? (
            nestedFolders.map((folder) =>{
                    return (
          <li
            key={folder.id}
  
          >
            <Folder_Render
  folder={folder}

    folderDrop={folderDrop} />         
          </li>
        );

            })
          ) : (
            <div>
              <p className="text-gray-500">Create New Folder.</p>
              <CreateFolder parentId={null} />
            </div>
          ))}
      </motion.div>
      
      {/* Main Content Area */}
      <NullSidebar nestedFolders={nestedFolders} />
      <IconPickerModal />
      <div
        ref={contentRef}
        className="overflow-auto flex-1"
      >
        <File />
      </div>
          {creatingFolderParentId === null && (
        <li>
          <CreateFolder parentId={null} />
        </li>
      )}
    </motion.div>
  );
}