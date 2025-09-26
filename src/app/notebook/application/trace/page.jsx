'use client';

import { useMemo,useRef,useEffect } from "react";
import { useToken } from '@/Server/AUTH/Token';
import { useAuthCheck } from '@/Server/AUTH/Auth-Check';
import { useFetchFolders } from "@/Server/GraphQl/Operations/FetchData/Fetch_Folder";
import { useFetchFiles } from "@/Server/GraphQl/Operations/FetchData/Fetch_File";
import { buildNestedStructure } from "@/Utils/Data_Structure/Structure";

import {useData} from "@/Zustand/Data"
import Folder_Render from '@/Components/Sidebar/Render/Folder';

export default function Dashboard() {

  const { dataFolders, dataFiles, setDataFolders, setDataFiles } = useData();
  
  // Data Fetching
  const { folders, loading, error } = useFetchFolders();
  const { files } = useFetchFiles();
  

  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);


  const initialized = useRef(false);
  const fileInt = useRef(false);
useEffect(() => {
  if (!initialized.current && folders) {
    setDataFolders(folders);
    initialized.current = true; 
  }
}, [folders]);

useEffect(() => {
  if (!fileInt.current && files) {
    setDataFiles(files);
    fileInt.current = true; 
  }
}, [files]);


  const nestedFolders = useMemo(() => {
    return Array.isArray(dataFolders) && dataFolders.length > 0
      ? buildNestedStructure(dataFolders, dataFiles)
      : null;
  }, [dataFolders, dataFiles]);
  


  if (loadingAuth) return <p>Loading...</p>;
  
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
      className="relative flex h-screen overflow-hidden "
 
    >
   
      <div
        className="overflow-auto h-full bg-gray-900 text-white flex flex-col  items-center py-4"
      >
         {nestedFolders.map((folder) => (
        <li key={folder.id}>
           <Folder_Render folder={folder} />
        </li>
))}         
      </div>
    </div>
  );
}