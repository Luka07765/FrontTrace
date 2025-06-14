'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/Utils/cn';
import { ContextClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from './tools/Resize-Bar';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';

export default function Dashboard() {
  const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin,
    setWidth,
  } = useResizable();

  const [selectedProject, setSelectedProject] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  const collapsedWidth = 60;
  const expandedWidth = 280;

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setWidth(next ? collapsedWidth : expandedWidth);
      return next;
    });
  };

  if (loadingAuth) return <p>Loading...</p>;

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      <motion.aside
        ref={sidebarRef}
        animate={{ width: isCollapsed ? collapsedWidth : expandedWidth }}
        transition={{ type: 'spring', damping: 15 }}
        className={cn('bg-gray-800 h-screen relative overflow-y-auto z-[1000]')}
      >
        {!selectedProject && (
          <motion.div>
            <ProjectLink name="Trace" setSelectedProject={setSelectedProject}>
              <div className="min-w-4 mx-2 border-pink-600 border rounded-full aspect-square bg-pink-700" />
            </ProjectLink>
            <ProjectLink name="Settings" setSelectedProject={setSelectedProject}>
              <div className="min-w-4 mx-2 border-indigo-600 border rounded-full aspect-square bg-indigo-700" />
            </ProjectLink>
            <ProjectLink name="Profile" setSelectedProject={setSelectedProject}>
              <div className="min-w-4 mx-2 border-cyan-600 border rounded-full aspect-square bg-cyan-700" />
            </ProjectLink>
          </motion.div>
        )}

        <button
          onClick={toggleSidebar}
          className="absolute top-2 left-0 bg-white text-black rounded px-2 py-1 text-xs z-50"
        >
          {isCollapsed ? '>' : '<'}
        </button>

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

        <ContextMenu />
      </motion.aside>

      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0 cursor-ew-resize z-[1001] group"
        style={{
          width: `${1 + hitAreaMargin * 2}px`,
          left: sidebarRef.current
            ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px`
            : '260px',
        }}
      >
        <div
          ref={resizerInnerRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-gray-600 transition-colors duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
          style={{ left: `${hitAreaMargin}px` }}
        />
      </div>

      <div
        ref={contentRef}
        style={{
          left: '260px',
          width: 'calc(100% - 280px)',
          overflow: 'auto',
        }}
      >
        <File />
      </div>
    </div>
  );
}
