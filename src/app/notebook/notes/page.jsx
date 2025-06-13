'use client';

import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/Utils/cn';
import { ContextClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from './tools/Resize-Bar';
import { useLogout } from '@/Server/Auth/Logout';
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
  } = useResizable();

  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
  const { handleLogout } = useLogout();

  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  useEffect(() => {
    if (isOpen) {
      containerControls.start('open');
      svgControls.start('open');
    } else {
      containerControls.start('close');
      svgControls.start('close');
    }
  }, [isOpen, containerControls, svgControls]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false); // keep sidebar open on desktop
      }
    };

    handleResize(); // On initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loadingAuth) return <p>Loading...</p>;

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      <motion.aside
        ref={sidebarRef}
        className={cn('bg-gray-800 h-screen relative overflow-y-auto z-[1000]')}
        animate={{ width: sidebarCollapsed ? 60 : 280 }}
        transition={{ duration: 0.2 }}
      >
        {/* Show toggle button only on mobile */}
        {isMobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded z-[1100]"
          >
            {sidebarCollapsed ? '➡️' : '⬅️'}
          </button>
        )}

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
                isOpen={isOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ContextMenu />
      </motion.aside>

      {/* Only show resizer on desktop */}
      {!isMobile && (
        <div
          ref={resizerRef}
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 cursor-ew-resize z-[1001] group"
          style={{
            width: `${1 + hitAreaMargin * 2}px`,
            left: sidebarRef.current
              ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px`
              : 260,
          }}
        >
          <div
            ref={resizerInnerRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-gray-600 transition-colors duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
            style={{ left: `${hitAreaMargin}px` }}
          />
        </div>
      )}

      <div
        ref={contentRef}
        style={{
          left: sidebarCollapsed ? '60px' : '280px',
          width: sidebarCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 280px)',
          overflow: 'auto',
        }}
      >
        <File />
      </div>
    </div>
  );
}
