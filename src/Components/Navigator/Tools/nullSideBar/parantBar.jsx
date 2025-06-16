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

export default function Dashboard() {
  const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin,setWidth
  } = useResizable();
    const {
       nullExpend, popupFolder, setNullExpend 
    } = useFolderStore();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
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
        className={cn(
          ' bg-gray-800 h-screen relative overflow-y-auto z-[1000]'
        )}
        style={{ width: '280px' }}
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

      
        <ContextMenu />

      </aside>
       {/* Resize */}
      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0  cursor-ew-resize z-[1001] group"
        style={{
          width: `${1 + hitAreaMargin * 2}px`,
          left: sidebarRef.current
            ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px`
            : 260,
        }}
      >
        <div
          ref={resizerInnerRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0  bg-gray-600 transition-color duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
          style={{ left: `${hitAreaMargin}px` }}
        />
      </div>
       {/* Main Content */}
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

 

      {/* <AnimatePresence>
        {nullExpend && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 h-full w-72 bg-gray-900 text-white z-[1050]"
            style={{
              left: sidebarRef.current
                ? `${sidebarRef.current.offsetWidth}px`
                : '280px',
            }}
          >
            <div className="p-4">
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-lg font-bold">{popupFolder?.title || 'Folder'}</h2>
    <button onClick={() => setNullExpend(false)} className="text-red-500 text-sm">Close</button>
  </div>


  {popupFolder?.children?.length > 0 ? (
    <Basic folders={popupFolder.children} />
  ) : (
    <p>No subfolders</p>
  )}

  {popupFolder?.files?.length > 0 && (
    <ul className="mt-4">
      {popupFolder.files
        .slice()
        .sort((a, b) => a.filePosition - b.filePosition)
        .map((file, index) => (
          <li key={file.id} className="text-sm pl-2">
            {file.title}
          </li>
        ))}
    </ul>
  )}
</div>

          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}
