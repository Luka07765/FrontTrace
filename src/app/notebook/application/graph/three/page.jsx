"use client";
import Tree3D from "./test";
import { buildNestedStructure } from "@/Utils/Data_Structure/Structure"; // adjust import
import { useFolderListLogic } from "@/Server/GraphQl/Operations/Logic/Folder_Logic";
import { useFileListLogic } from "@/Server/GraphQl/Operations/Logic/File_Logic";
export default function Page() {
const { files  } = useFileListLogic();
const { folders,loading  ,error} = useFolderListLogic();
  if (!folders || !files) {
    return <div>Loading...</div>;
  }
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
const nested = buildNestedStructure(folders, files);




  return <Tree3D data={nested} />;
}
