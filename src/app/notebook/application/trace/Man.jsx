'use client';
import { useEffect, useRef } from "react";
import { useFetchFolders } from "@/Server/GraphQl/Operations/FetchData/Fetch_Folder";
import { useFetchFiles } from "@/Server/GraphQl/Operations/FetchData/Fetch_File";
import { useData } from "@/Zustand/Data";

export function useInitFoldersAndFiles() {
  const {dataFolder, setDataFolders, setDataFiles } = useData();

  const { folders, loading: foldersLoading, error: foldersError } = useFetchFolders();
  const { files, loading: filesLoading, error: filesError } = useFetchFiles();

  const initializedFolders = useRef(false);
  const initializedFiles = useRef(false);

  // Sync folders
  useEffect(() => {
    if (!initializedFolders.current && folders) {
      setDataFolders(folders);
      initializedFolders.current = true;
    }
    console.log("Zustand folders after set:", useData.getState().dataFolders);
  }, [folders, setDataFolders]);

  // Sync files
  useEffect(() => {
    if (!initializedFiles.current && files) {
      setDataFiles(files);
      initializedFiles.current = true;
    }
  }, [files, setDataFiles]);
 
  return {
    loading: foldersLoading || filesLoading,
    error: foldersError || filesError
  };
}
