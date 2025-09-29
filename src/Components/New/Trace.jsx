// DashboardView.jsx
import Folder_Data from '@/Components/New/Tools/Data/Folder_Data';
import Folder from '@/Components/New/Render/Folder_Render';
import { motion} from 'framer-motion';
import { useState} from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ExpandButton from "@/Components/New/Tools/other/ExpendButton"; // import button component

export default function Trace() {
    const [expand, setExpand] = useState(false);
  return (
    <motion.div className="relative flex h-screen ">
      <motion.div   
          className="h-full bg-gray-900 text-white "
            layout
          animate={{ width: expand ? '6rem' : '16rem' }}
          transition={{ type: 'spring', damping: expand ? 17 : 30 }}
        >
          <SimpleBar style={{ maxHeight: "100vh", overflowX: "hidden"  }}>
            <ul className="p-2 pb-20">
              <Folder_Data render={folder => (
                <li className="list-none" key={folder.id}>
                  <Folder folder={folder}  />
                </li> )}/>
            </ul>
          </SimpleBar>
  
      </motion.div>
      
      <ExpandButton expand={expand} setExpand={setExpand}/>
        
    </motion.div>
  );
}
