import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Profile from '@/Components/Navigator/Tools/UserProfile/Profile';
import Sidebar from '@/Components/Navigator/Sidebar';
import Settings from '@/Components/Navigator/Tools/Settings/Settings';

const projectComponents = {
  Trace: <Sidebar />,
  Settings: <Settings />,
  Profile: <Profile />,
};

const ProjectNavigation = ({ selectedProject, setSelectedProject }) => {
  return (
    <motion.div
      key="project-nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-row w-full justify-between items-center">
        <h1 className="tracking-wide text-neutral-100 text-lg">
          {selectedProject}
        </h1>
        <button onClick={() => setSelectedProject(null)}>
          <XMarkIcon className="w-8 stroke-neutral-400" />
        </button>
      </div>

      <input
        placeholder="Search"
        type="text"
        className="px-3 py-2 tracking-wide rounded-lg bg-neutral-600/40 text-neutral-100"
      />

      <div className="flex flex-col gap-3">
        {projectComponents[selectedProject] || <Sidebar />}
      </div>
    </motion.div>
  );
};

export default ProjectNavigation;
