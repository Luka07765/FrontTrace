import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Basic } from './Tools/Basic_Render';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { Select } from '@/Zustand/Select_Store';
import {useMemo} from "react";
import { useContextMenuActions } from './Tools/ContextMenu/Actions';
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';
export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
  const {
    createFolder,
  } = useContextMenuActions();
  const { setSelectedFolderId } = Select();
  const { files } = useFileListLogic();

   const nestedFolders = useMemo(() => {
    return Array.isArray(folders) && folders.length > 0
      ? buildNestedStructure(folders, files)
      : null;
  }, [folders, files]);

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

    >
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
      {nestedFolders ? (
        <Basic folders={nestedFolders} />
      ) : (
        <div>
          {' '}
          <p className="text-gray-500">Create New Folder.</p>
          <CreateFolder parentId={null} />
        </div>
      )}
   
    </div>
  );
}
