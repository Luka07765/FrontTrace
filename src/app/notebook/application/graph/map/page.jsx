'use client';
import { useFolderListLogic } from '@/Server/GraphQl/Operations/Logic/Folder_Logic';
import ForceDirectedTree from './TreeMap';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import { useFileListLogic } from "@/Server/GraphQl/Operations/Logic/File_Logic";

function Page() {
  const { folders, error, loading } = useFolderListLogic();
   const { files } = useFileListLogic();
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
        <ForceDirectedTree structure={nestedFolders} />
      ) : (
        <p className="text-gray-500">No folders to display.</p>
      )}
    </div>
  );
}

export default Page;
