import {
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CursorArrowRaysIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import NavigationLink from './NavigationLink';

const variants = {
  close: {
    x: -300,
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 100,
  },
};

const ProjectNavigation = ({ selectedProject, isOpen, setSelectedProject }) => {
  return (
    <motion.nav
      variants={variants}
      initial="close"
      animate="open"
      exit="close"
      transition={{
        duration: 0.25,
        ease: 'easeInOut',
      }}
      className={`h-full flex flex-col gap-8 w-64 absolute bg-neutral-900 ml-0 ${
        isOpen ? 'left-64' : 'left-20'
      } border-r border-neutral-800 p-5`}
    >
      <div className="flex flex-row w-full justify-between place-items-center">
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
        <NavigationLink name="Progress">
          <ArrowTrendingUpIcon className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLink>
      </div>
    </motion.nav>
  );
};

export default ProjectNavigation;
