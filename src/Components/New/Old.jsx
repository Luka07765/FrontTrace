'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState,useRef,useEffect } from "react";
import { ContextClick } from '@/Zustand/Context_Store';
import {IconPickerModal} from "@/Components/Sidebar/Ui/U_Icons/IconUi"

import { findMatchingItems } from "@/Components/Sidebar/Logic/L_Search/Logic_Search";
import { useFolderStore } from '@/Zustand/Folder_Store';

import Folder_Render from '@/Components/Sidebar/Render/Folder';
import File from '@/Components/Work_Space/WorkPage';
import NullSidebar from '@/Components/Sidebar/Ui/U_Null/UiNull';
import SearchResults from "@/Components/Sidebar/Ui/U_Search/Ui_Search";
import CreateFolder from "@/Components/Sidebar/Logic/Actions/Create_Folder";
import ContextMenu from '@/Components/Sidebar/Ui/U_ContextMenu/Context_Ui';
import useResizable from '@/Components/Sidebar/Logic/Actions/Resize-Bar';
import { useContextMenuActions } from "@/Components/Sidebar/Logic/L_Context/Actions";

export default function Dashboard() {
  const { creatingFolderParentId } = useFolderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const { setContextMenuVisible,setSelectedFolderId } = ContextClick();
  const { contentRef } = useResizable();  

  const { createFolder } = useContextMenuActions();

  const matchingItems = searchTerm
    ? findMatchingItems(nestedFolders || [], searchTerm)
    : [];

 
  return (
    <motion.div
      className="relative flex h-screen overflow-hidden "
      onClick={() => setContextMenuVisible(false)}
    >
      {/* Sidebar */}
      <motion.div
  
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
  folder={folder} />         
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