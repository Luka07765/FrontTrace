// DashboardContainer.jsx
'use client';

import { useToken } from '@/Server/AUTH/Token';
import { useAuthCheck } from '@/Server/AUTH/Auth-Check';
import { useDataFetch } from "@/app/notebook/application/trace/Data/Fetch_Data";
import Trace from './Trace';

export default function DashboardContainer() {
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

  return <Trace  />;
}
