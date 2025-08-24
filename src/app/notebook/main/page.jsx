'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { ContextClick } from '@/Zustand/Context_Store';
import { useToken } from '@/Server/Auth/Token';
import { useAuthCheck } from '@/app/notebook/main/tools/Auth/Auth-Check';
import ProjectLink from '@/app/notebook/main/tools/Logic/Projects';
import ProjectNavigation from '@/app/notebook/main/tools/Logic/ProjectNav';

import File from '@/Components/Work_Space/WorkPage';
import NullSidebar from './tools/UI/NullSidebar';
import useResizable from './tools/Logic/Resize-Bar';
export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
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
        <div className="flex gap-2 mb-4">
        </div>
        {!selectedProject && (
          <div className="flex flex-col gap-5 w-full px-4">
            <ProjectLink name="Trace" setSelectedProject={setSelectedProject}>
            <div className="min-w-4 mx-2 border-pink-600 border rounded-full aspect-square bg-pink-700" />
            </ProjectLink>
            <ProjectLink name="Settings" setSelectedProject={setSelectedProject}>
            <div className="min-w-4 mx-2 border-indigo-600 border rounded-full aspect-square bg-indigo-700" />
            </ProjectLink>
            <ProjectLink name="Profile" setSelectedProject={setSelectedProject}>
            <div className="min-w-4 mx-2 border-cyan-600 border rounded-full aspect-square bg-cyan-700" />
            </ProjectLink>
          </div>
        )}
        
            <div className="flex-1 overflow-auto p-4">
        <AnimatePresence>
          {selectedProject && (
            <motion.div
                  key="project-nav"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col mt-5"
            >
              <ProjectNavigation
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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