'use client';
import { useData } from "@/Zustand/Data";

export default function useFolderData({ render }) {
  const nestedFolders = useData(state => state.nestedFolders);

  return (
    <>
      {nestedFolders.map(folder => render(folder))}
    </>
  );
}
