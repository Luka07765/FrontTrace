'use client';

import { useToken } from '@/Server/AUTH/Token';
import { useAuthCheck } from '@/Server/AUTH/Auth-Check';

import Folder_Data from './Data/Folder_Data';
import Folder from '@/app/notebook/application/trace/Render/Folder_Render';
import { useDataFetch } from "@/app/notebook/application/trace/Data/Fetch_Data";

export default function Dashboard() {
  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  const { loading, error } = useDataFetch();


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

  return (
    <div className="relative flex h-screen overflow-hidden">
    <div className="overflow-y-auto overflow-x-hidden h-full bg-gray-900 text-white items-left py-4">
        <Folder_Data render={folder => (
          <li className="list-none" key={folder.id}>
            <Folder folder={folder} />
          </li>
        )} />
      </div>
 </div>
  );
}
