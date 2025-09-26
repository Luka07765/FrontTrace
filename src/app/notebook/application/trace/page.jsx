'use client';
import { useState } from "react";
import { useToken } from '@/Server/AUTH/Token';
import { useAuthCheck } from '@/Server/AUTH/Auth-Check';
import Dash from "./Dash/DashBoard";
import FolderList from './Data';
import Folder_Render from '@/Components/Sidebar/Render/Folder';
import { useInitFoldersAndFiles } from "./Man";
import { useData } from "@/Zustand/Data";
export default function Dashboard() {
    const {dataFolder, setDataFolders, setDataFiles } = useData();
  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  const { loading, error } = useInitFoldersAndFiles();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
      {/* Sidebar */}
      <div className="overflow-auto h-full bg-gray-900 text-white flex flex-col items-center py-4">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Open Popup
        </button>

        <FolderList render={folder => (
          <li key={folder.id}>
            <Folder_Render folder={folder} />
          </li>
        )} />
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <Dash />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
