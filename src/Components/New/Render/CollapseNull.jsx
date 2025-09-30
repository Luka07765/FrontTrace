import { motion } from "framer-motion";
import { cn } from "@/Utils/cn";
import ContextMenu from '@/Components/Sidebar/Ui/U_ContextMenu/Context_Ui';

export default function ExpandedSidebar({ sidebarRef, resizerRef, resizerInnerRef, handleMouseDown, hitAreaMargin, setNullExpend }) {
  return (
    
    <motion.div
      exit={{ width: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className=" z-[1000] bg-gray-800 h-screen overflow-y-auto overflow-x-hidden"
    >   <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0 cursor-ew-resize z-[1001] group"
        style={{
          width: `${1 + hitAreaMargin * 2}px`,
          left: 150,
        }}
      >
        <div
          ref={resizerInnerRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-gray-600 transition-color duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
        />
      </div>
      <aside ref={sidebarRef} style={{ width: 170 }}>
        <div className="p-4">
            
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => {
                if (resizerRef.current) resizerRef.current.style.display = 'none';
                setNullExpend(false);
              }}
              className="text-red-500 text-sm"
            >
              Close
            </button>
            
          </div>
          <h1>CONTENT</h1>
        </div>
        
      </aside>



   
    </motion.div>
  );
}
