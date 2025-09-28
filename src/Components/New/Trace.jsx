// DashboardView.jsx
import Folder_Data from '@/Components/New/Data/Folder_Data';
import Folder from '@/Components/New/Render/Folder_Render';
import { motion, AnimatePresence } from 'framer-motion';
import { useState} from "react";
export default function Trace() {
    const [expand, setExpand] = useState(false);
  return (
    <motion.div className="relative flex h-screen overflow-hidden">

      <motion.div className="overflow-y-auto overflow-x-hidden h-full bg-gray-900 text-white items-left pb-40 "
      animate={{ maxWidth: expand ? '7rem' : '16rem' }}
  transition={{ type: 'spring', damping: 15 }}
        >

   
        <Folder_Data render={folder => (
          <li className="list-none" key={folder.id}>
            <Folder folder={folder}  />
          </li>
        )}/>
      </motion.div>
                          <button
          onClick={() => setExpand(!expand)}
       className="h-2.5 opacity-0 hover:opacity-100 p-2 bg-gray-700 rounded transition-opacity duration-200"
        >
          {expand ? '▶' : '◀'}
        </button>
    </motion.div>
  );
}
