'use client';
import { useFetchFolders } from '@/Server/GraphQl/Operations/FetchData/Fetch_Folder';
import SidebarTree from '@/Components/Tags/Master_Tree';
import { useFetchFiles } from "@/Server/GraphQl/Operations/FetchData/Fetch_File";
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
function Page() {
    const { files } = useFetchFiles();
  const { folders, error, loading } = useFetchFolders();
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
  const nestedFolders = buildNestedStructure(folders,files);



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
