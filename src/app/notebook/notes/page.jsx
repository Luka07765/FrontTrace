'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/Utils/cn';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import NullFolder from "@/Components/Navigator/Tools/nullSideBar/parantBar"
import { ContextClick } from '@/Zustand/Context_Store';
import { useToken } from '@/Server/Auth/Token';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';
import { useFolderStore } from '@/Zustand/Folder_Store';
import File from '@/Components/Work_Space/WorkPage';

import useResizable from './tools/Resize-Bar';
export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } = useToken();
    const {
       nullExpend,   popupFolder, setNullExpend 
    } = useFolderStore();
      const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin
  } = useResizable();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);

    const [asideMode, setAsideMode] = useState("relative");


  if (loadingAuth) return <p>Loading...</p>;
  const targetWidth = nullExpend ? 170 : 0;
const motionProps = asideMode === "absolute" ? {
  initial: { width: 0 },
  animate: { width: targetWidth },
  exit: { width: 0 },
  transition: { type: 'spring', damping: 20 },
} : {
  initial: {},
  animate: {},
  exit: {},
  transition: { type: 'spring', damping: 20 },
};

  return (
    <motion.div
      className="relative flex h-screen overflow-hidden"
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
          <button
            onClick={() => setAsideMode('relative')}
            className="p-2 bg-green-700 rounded hover:bg-green-600"
          >
            Relative
          </button>
          <button
            onClick={() => setAsideMode('absolute')}
            className="p-2 bg-blue-700 rounded hover:bg-blue-600"
          >
            Absolute
          </button>
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
            
                 <AnimatePresence> 
                     {nullExpend && (
                 
                      
         <motion.nav
       key={asideMode}
  className={asideMode === "relative" ? "relative z-[1000]" : "relative flex-shrink-0 h-screen bg-gray-800"}
  {...motionProps}
    >
                           <aside
                              ref={sidebarRef}
      
                                     className={cn(
    asideMode === "relative"
      ? "bg-gray-800 h-screen overflow-y-auto z-[1000]"
      : "h-full overflow-y-auto"
  )}
  style={asideMode === "relative" ? { width: 170 } : undefined}
                        >
                          <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-bold">{popupFolder?.title || 'Folder'}</h2>
                      <button onClick={() => setNullExpend(false)} className="text-red-500 text-sm">Close</button>
                    </div>
                  
        
              <NullFolder />
                  </div>
                  
                        
                          <ContextMenu />
                  
                        </aside>
                              <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0   cursor-ew-resize z-[1001] group"
        style={{
          width: `${1 + hitAreaMargin * 2}px`,
          left:150
     
       
        }}
      >
        <div
          ref={resizerInnerRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0  bg-gray-600 transition-color duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"

        />
      </div>
      </motion.nav>
              )}
              </AnimatePresence>
     
  <div
  ref={contentRef}
  className="overflow-auto flex-1"

>
  <File />
</div>

    </motion.div>
  );
}