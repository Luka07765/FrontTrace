'use client';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import SidebarTree from '@/Components/SidebarTree/Master_Tree';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
function Page() {
  const { folders, error, loading } = useFolderListLogic();
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
  const nestedFolders = buildNestedStructure(folders);



  return (
    <div>
      {nestedFolders ? (
        <SidebarTree structure={nestedFolders} />
      ) : (
        <p className="text-gray-500">No folders to display.</p>
      )}
    </div>
  );
}

export default Page;
