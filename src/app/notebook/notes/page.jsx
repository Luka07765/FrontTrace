'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { ContextClick } from '@/Zustand/Context_Store';


import { useToken } from '@/Server/Auth/Token';


import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';

export default function Dashboard() {

  const [selectedProject, setSelectedProject] = useState(null);
  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } =
    useToken();


const loadingAuth = useAuthCheck(cancelTokenRefresh);


 if (loadingAuth) return <p>Loading...</p>;
  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
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

      


      <div
  
      >
        <div
   
        />
      </div>


    </div>
  );
}
