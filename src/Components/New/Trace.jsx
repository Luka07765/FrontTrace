// DashboardView.jsx
import Folder_Data from '@/Components/New/Data/Folder_Data';
import Folder from '@/Components/New/Render/Folder_Render';
import { motion, AnimatePresence } from 'framer-motion';
import { useState,useRef} from "react";
import NextIcon from "@/assets/FolderFile_Icons/next.png"
import Image from 'next/image';
import "@/Components/New/Render/style.css"
export default function Trace() {
    const [expand, setExpand] = useState(false);


  return (
    <motion.div className="relative flex h-screen overflow-hidden">
      <motion.div   

        className="sidebar overflow-x-hidden h-full bg-gray-900 text-white pb-40"
      animate={{ maxWidth: expand ? '6rem' : '16rem' }}
  transition={{ type: 'spring', damping: 15 }}
        >

       
        <Folder_Data render={folder => (
          
          <li
           className="list-none" key={folder.id}>
            <Folder folder={folder}  />
          </li>
        )}/>
      </motion.div>
<button
  onClick={() => setExpand(!expand)}
  className="h-8 w-8 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200"
>
      <Image
                  src={ NextIcon }
                  alt={'Folder Open' }
                  width={35}
                  height={25}
                 className="filter invert"
                />
</button>

    </motion.div>
  );
}
