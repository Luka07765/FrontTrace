// DashboardView.jsx
import Folder_Data from '@/Components/New/Tools/Data/Folder_Data';
import Folder from '@/Components/New/Render/Folder_Render';
import { motion} from 'framer-motion';
import { useState} from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ExpandButton from "@/Components/New/Tools/other/ExpendButton"; // import button component
import NullSidebar from '@/Components/New/Render/Null/NullSidebar';
import Content from "@/Components/New/Tools/Content"
import useResizable from '@/Components/Sidebar/Logic/Actions/Resize-Bar';
export default function Trace() {
    const { contentRef } = useResizable();  
    const [expand, setExpand] = useState(false);
    
  return (
    <motion.div className="relative flex h-screen ">
      <motion.div   
          className="h-full bg-gray-900 text-white "
        
          animate={{ width: expand ? '6rem' : '16rem' }}
          transition={{ type: 'spring', damping: expand ? 17 : 30 }}
        > 
          <ExpandButton expand={expand} setExpand={setExpand}/>
          <SimpleBar style={{ maxHeight: "100vh", overflowX: "hidden"  }}>
            <ul className="p-2 pb-20">
              <Folder_Data render={folder => (
                <li className="list-none" key={folder.id}>
                  <Folder folder={folder} expand={expand}  />
                </li> )}/>
            </ul>
          </SimpleBar>
  
      </motion.div>
      
      <NullSidebar />

        
    </motion.div>
  );
}
