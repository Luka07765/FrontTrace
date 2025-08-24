'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Sidebar from '@/app/notebook/trace/Sidebar';
import { ContextClick } from '@/Zustand/Context_Store';
import { useToken } from '@/Server/Auth/Token';
import { useAuthCheck } from '@/app/notebook/main/Auth/Auth-Check';

import File from '@/Components/Work_Space/WorkPage';
import NullSidebar from './UI/NullSidebar';
import useResizable from '../../../Components/Nav/Tools/Logic/Actions/Resize-Bar';
export default function Dashboard() {

  const [collapsed, setCollapsed] = useState(false);
  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
  const {
    contentRef,
  } = useResizable();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);
  if (loadingAuth) return <p>Loading...</p>;

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
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          {collapsed ? '▶' : '◀'}
        </button>

        
<Sidebar />
      </motion.div>  
     <NullSidebar />
     
<div
  ref={contentRef}
  className="overflow-auto flex-1"
>
  <File />
</div>
    </motion.div>
  );
}