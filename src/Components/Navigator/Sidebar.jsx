import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

import { ContextMenu } from './Tools/Right_Click';
import { FolderTree } from './Tools/Basic_Render';
import { Click } from '@/Zustand/Click_Store';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';

export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
  const { contextMenuVisible, setContextMenuVisible, setContextMenuPosition } =
    Click();

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

  const nestedFolders =
    folders && folders.length > 0 ? buildNestedStructure(folders) : [];

  return (
    <div
      className="relative w-64 bg-gray-800 text-white h-screen p-4 overflow-auto"
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
      }}
    >
      {nestedFolders.length > 0 ? (
        <FolderTree folders={nestedFolders} />
      ) : (
        <p className="text-gray-500">No folders to display.</p>
      )}

      {contextMenuVisible && <ContextMenu />}
    </div>
  );
}
