'use client';
import { useEffect, useRef } from "react";
import { useFetchFolders } from "@/Server/GraphQl/Operations/FetchData/Fetch_Folder";
import { useFetchFiles } from "@/Server/GraphQl/Operations/FetchData/Fetch_File";
import { useData } from "@/Zustand/Data";

export function useDataFetch() {
  const { setDataFolders, setDataFiles } = useData();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  // Sync files
useEffect(() => {
  if (!initializedFiles.current && files) {
    setDataFiles(files);
    initializedFiles.current = true;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [files]);

 
  return {
    loading: foldersLoading || filesLoading,
    error: foldersError || filesError
  };
}
