'use client';
import { motion,  AnimatePresence } from 'framer-motion';
import {  useState } from 'react';
import { cn } from '@/Utils/cn';
import { ContextClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { Basic } from '@/Components/Navigator/Tools/Basic_Render';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from './tools/Resize-Bar';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';
import NullFolder from "@/Components/Navigator/Tools/nullSideBar/parantBar"
export default function Dashboard() {
  const {
    sidebarRef,
setWidth
  } = useResizable();
    const {
       nullExpend, 
    } = useFolderStore();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } =
    useToken();


const loadingAuth = useAuthCheck(cancelTokenRefresh);
const toggleSidebar = () => {
  setIsCollapsed((prev) => {
    const next = !prev;
    setWidth(next ? 60 : 280);
    return next;
  });
};


 if (loadingAuth) return <p>Loading...</p>;
  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >   {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className=' bg-gray-800 h-screen relative overflow-y-auto z-[1000]'
      >
       
        {!selectedProject && (
  <motion.div

  >
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
)}<button
  onClick={toggleSidebar}
  className="absolute top-2  left-0 bg-white text-black rounded px-2 py-1 text-xs z-50"
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

      


      </aside>
      <AnimatePresence>
        {nullExpend && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 h-full  bg-gray-900 text-white z-[1050]"
            style={{
              left: sidebarRef.current
                ? `${sidebarRef.current.offsetWidth}px`
                : '280px',
     
            }}
          >
            <NullFolder />


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
