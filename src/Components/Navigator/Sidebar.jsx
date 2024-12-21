import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useLogout } from '@/Server/Auth/Logout';
import { ContextMenu } from './Tools/Right_Click';
import { Basic } from './Tools/Basic_Render';
import { RightClick } from '@/Zustand/Context_Store';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { Select } from '@/Zustand/Select_Store';
export default function FolderList() {
  const { folders, loading, error } = useFolderListLogic();
  const { contextMenuVisible, setContextMenuVisible, setContextMenuPosition } =
    RightClick();
  const { setSelectedFolderId } = Select();
  const { handleLogout } = useLogout();
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
      className=" h-full   bg-gray-800 text-white p-4 flex flex-col justify-between overflow-auto"
      onClick={handleParentClick}
      onContextMenu={(e) => {
        e.preventDefault();

        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
      }}
    >
      {nestedFolders ? (
        <Basic folders={nestedFolders} />
      ) : (
        <p className="text-gray-500">No folders to display.</p>
      )}
      {contextMenuVisible && <ContextMenu />}{' '}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
}
