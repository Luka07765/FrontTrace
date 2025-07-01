"use client"
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import ProjectLink from '@/app/notebook/css/Sectors/Projects';
import ProjectNavigation from '@/app/notebook/css/Sectors/ProjectNav';

const containerVariants = {
  close: {
    width: '5rem',
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: '16rem',
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  useEffect(() => {
    if (isOpen) {
      containerControls.start('open');
      svgControls.start('open');
    } else {
      containerControls.start('close');
      svgControls.start('close');
    }
  }, [isOpen, containerControls, svgControls]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
    setSelectedProject(null); // Resetuj izbor kada se menja stanje menija
  };

  return (
    <>
      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial="close"
        className="bg-neutral-900 flex flex-col z-10 gap-20 p-5 absolute top-0 left-0 h-full shadow shadow-neutral-600"
      >
        <input
          placeholder="Search"
          type="text"
          className="px-3 py-2 tracking-wide rounded-lg bg-neutral-600/40 text-neutral-100"
        />
        <div className="flex flex-row w-full justify-between items-center">
          <div className="w-10 h-10 bg-gradient-to-br" />

          <button
            className="p-1 rounded-full flex"
            onClick={() => handleOpenClose()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8 stroke-neutral-200"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={svgVariants}
                animate={svgControls}
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {/* Klikom na ProjectLink postavljamo odgovarajući selectedProject */}
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
      </motion.nav>
      <AnimatePresence>
        {selectedProject && (
          <ProjectNavigation
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
