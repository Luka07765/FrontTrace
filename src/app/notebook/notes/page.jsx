'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import NullFolder from "@/Components/Navigator/Tools/nullSideBar/parantBar"
import { ContextClick } from '@/Zustand/Context_Store';
import { useToken } from '@/Server/Auth/Token';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';
import { useFolderStore } from '@/Zustand/Folder_Store';
export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
    const {
       nullExpend, 
    } = useFolderStore();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);
  if (loadingAuth) return <p>Loading...</p>;

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? '5rem' : '16rem' }}
        transition={{ type: 'spring', damping: 15 }}
        className="h-full bg-gray-900 text-white flex flex-col items-center py-4"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          {collapsed ? '▶' : '◀'}
        </button>

        {!selectedProject && (
          <div className="flex flex-col items-center gap-4">
            <ProjectLink name="Trace" setSelectedProject={setSelectedProject}>
              <div className="w-6 h-6 border-pink-600 border rounded-full bg-pink-700" />
            </ProjectLink>
            <ProjectLink name="Settings" setSelectedProject={setSelectedProject}>
              <div className="w-6 h-6 border-indigo-600 border rounded-full bg-indigo-700" />
            </ProjectLink>
            <ProjectLink name="Profile" setSelectedProject={setSelectedProject}>
              <div className="w-6 h-6 border-cyan-600 border rounded-full bg-cyan-700" />
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

      {/* Main Content */}

         {nullExpend && (
                     <motion.div
              key="project-nav"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col mt-5"
            >
                  <NullFolder />
      
      
                </motion.div>
              )}
  
    </div>
  );
}
