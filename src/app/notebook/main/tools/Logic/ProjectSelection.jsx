'use client';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectLink from '@/app/notebook/main/tools/Logic/Projects';
import ProjectNavigation from '@/app/notebook/main/tools/Logic/ProjectNav';
import {useSelectStore} from '@/Zustand/Select_Store'

export default function ProjectSection() {
    const {selectedProject,setSelectedProject} = useSelectStore();
  return (
    <>
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
   
    </>
  );
}
