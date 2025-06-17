'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ContextClick } from '@/Zustand/Context_Store';
import { useToken } from '@/Server/Auth/Token';
import useResizable from './tools/Resize-Bar';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';
import NullFolder from "@/Components/Navigator/Tools/nullSideBar/parantBar";

export default function Dashboard() {
  const { sidebarRef, setWidth } = useResizable();
  const { nullExpend } = useFolderStore();

  const [selectedProject, setSelectedProject] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  const collapsedWidth = 80;
  const expandedWidth = 280;

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    setWidth(next ? collapsedWidth : expandedWidth);
  };

  if (loadingAuth) return <p>Loading...</p>;

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        animate={{ width: isCollapsed ? collapsedWidth : expandedWidth }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-gray-800 h-screen overflow-y-auto z-[1000] relative"
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 bg-white text-black rounded px-2 py-1 text-xs z-50"
        >
          {isCollapsed ? '▶' : '◀'}
        </button>

        {!selectedProject && (
          <div className="mt-8 flex flex-col items-center">
            <ProjectLink name="Trace" setSelectedProject={setSelectedProject}>
              <div className="w-6 h-6 mx-2 border-pink-600 border rounded-full bg-pink-700" />
            </ProjectLink>
            <ProjectLink name="Settings" setSelectedProject={setSelectedProject}>
              <div className="w-6 h-6 mx-2 border-indigo-600 border rounded-full bg-indigo-700" />
            </ProjectLink>
            <ProjectLink name="Profile" setSelectedProject={setSelectedProject}>
              <div className="w-6 h-6 mx-2 border-cyan-600 border rounded-full bg-cyan-700" />
            </ProjectLink>
          </div>
        )}

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
      </motion.aside>

      {/* Popup Sidebar */}
      <AnimatePresence>
        {nullExpend && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 h-full bg-gray-900 text-white z-[1050]"
            style={{
              left: sidebarRef.current
                ? `${sidebarRef.current.offsetWidth}px`
                : `${expandedWidth}px`,
            }}
          >
            <NullFolder />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}