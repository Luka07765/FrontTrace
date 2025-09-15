'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { ContextClick } from '@/Zustand/Context_Store';
import { useToken } from '@/Server/Auth/Token';
import { useAuthCheck } from '@/Server/Auth/Auth-Check';
import ProjectSection from './Logic/ProjectSelection';
import { useRouter } from 'next/navigation';
export default function Dashboard() {
const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
 
  const loadingAuth = useAuthCheck(cancelTokenRefresh);
  if (loadingAuth) return <p>Loading...</p>;
  const handleTrace = () => {

    router.push('/notebook/application/trace'); 
  };
    const handleWeaver = () => {

    router.push('/notebook/application/graph/tags'); 
  };
  return (
    <motion.div
      className="relative flex h-screen overflow-hidden "
      onClick={() => setContextMenuVisible(false)}
      
    >
      <motion.div
        animate={{ width: collapsed ? '5rem' : '16rem' }}
        transition={{ type: 'spring', damping: 15 }}
        className="h-full bg-gray-900 text-white flex flex-col  items-center py-4"
      >
             <button
        onClick={handleTrace}
        className="px-14 py-7 bg-black text-white rounded-md hover:bg-gray transition duration-200"
      >
        Trace
      </button>

                <button
        onClick={handleWeaver}
        className="px-14 py-7 bg-black text-white rounded-md hover:bg-gray transition duration-200"
      >
        Weaver
      </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          {collapsed ? '▶' : '◀'}
        </button>

        
        <ProjectSection
  />
      </motion.div>  

    </motion.div>
  );
}