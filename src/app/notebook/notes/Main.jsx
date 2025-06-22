'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/Utils/cn';
import { ContextClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from './tools/Resize-Bar';
import { useFolderStore } from '@/Zustand/Folder_Store';
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

  const { nullExpend, popupFolder, setNullExpend } = useFolderStore();

  const [selectedProject, setSelectedProject] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();

  const loadingAuth = useAuthCheck(cancelTokenRefresh);

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setWidth(next ? 60 : 280);
      return next;
    });
  };

  // Width of toggle button in px (adjust if you change button style)
  const toggleButtonWidth = 40;

  if (loadingAuth) return <p>Loading...</p>;

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      {/* Toggle Sidebar Show/Hide Button positioned fixed on left */}
      <button
        onClick={() => setShowSidebar((v) => !v)}
        className="fixed top-2 left-0 z-[1100] p-2 bg-blue-600 text-white rounded-r"
        style={{ width: toggleButtonWidth }}
      >
        {showSidebar ? 'Hide' : 'Show'}
      </button>

      {/* Sidebar shifted right by toggleButtonWidth */}
      {showSidebar && (
        <aside
          ref={sidebarRef}
          className={cn('bg-gray-800 h-screen relative overflow-y-auto z-[1000]')}
          style={{
            width: isCollapsed ? 60 : 280,
            position: 'fixed',
            top: 0,
            left: toggleButtonWidth,
            height: '100vh',
          }}
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

          {/* Collapse Sidebar Button */}
          <button
            onClick={toggleSidebarCollapse}
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
        </aside>
      )}

      {/* Resize Bar shifted by toggleButtonWidth + sidebar width */}
      {showSidebar && (
        <div
          ref={resizerRef}
          onMouseDown={handleMouseDown}
          className="fixed top-0 bottom-0 cursor-ew-resize z-[1001] group"
          style={{
            width: `${1 + hitAreaMargin * 2}px`,
            left:
              toggleButtonWidth +
              (sidebarRef.current ? sidebarRef.current.offsetWidth - hitAreaMargin : 260),
          }}
        >
          <div
            ref={resizerInnerRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-gray-600 transition-color duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
            style={{ left: `${hitAreaMargin}px` }}
          />
        </div>
      )}

      {/* Main Content shifted right by toggleButtonWidth + sidebar width */}
      <div
        ref={contentRef}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: showSidebar
            ? toggleButtonWidth + (isCollapsed ? 60 : 280)
            : toggleButtonWidth,
          width: showSidebar
            ? `calc(100% - ${toggleButtonWidth + (isCollapsed ? 60 : 280)}px)`
            : `calc(100% - ${toggleButtonWidth}px)`,
          overflow: 'auto',
        }}
      >
        <File />
      </div>
    </div>
  );
}
