import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';

import { ContextMenu } from './Tools/ContextMenu/Context_Ui';
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

  return (
    <div
      className=" p-4 text-white "
      onClick={handleParentClick}
      onContextMenu={(e) => {
        e.preventDefault();

        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY - 100 });
      }}
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
      {contextMenuVisible && <ContextMenu />}{' '}
    </div>
  );
}
