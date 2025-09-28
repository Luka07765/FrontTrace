'use client';

import { useToken } from '@/Server/AUTH/Token';
import { useAuthCheck } from '@/Server/AUTH/Auth-Check';

import FolderList from './Data';
import Folder_Render from '@/Components/Sidebar/Render/Folder';
import { useInitFoldersAndFiles } from "./Man";

export default function Dashboard() {
  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  const { loading, error } = useInitFoldersAndFiles();



  // Loading and error states
  if (loadingAuth) return <p>Loading...</p>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading folders & files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="relative flex h-screen overflow-hidden">

      <div className="overflow-auto h-full bg-gray-900 text-white flex flex-col items-center py-4">
        <FolderList render={folder => (
          <li key={folder.id}>
            <Folder_Render folder={folder} />
          </li>
        )} />
      </div>

      
    </div>
  );
}
