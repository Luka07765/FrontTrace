import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { Basic } from './Tools/Basic_Render';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { Select } from '@/Zustand/Select_Store';
import {useMemo} from "react";
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';
export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();

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


  const handleParentClick = () => {
    setSelectedFolderId(null);
  };



  return (
    <div
      className=" p-4 text-white "
      onClick={handleParentClick}
    >
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
