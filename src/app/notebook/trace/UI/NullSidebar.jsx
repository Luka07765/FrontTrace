import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/Utils/cn";
import NullFolder from "@/Components/Nav/Render/NullBar/NullSidebar";
import ContextMenu from "@/Components/Nav/Tools/Ui/ContextMenu/Context_Ui";
import { useState, useEffect } from "react";
import { useFolderStore } from "@/Zustand/Folder_Store";

import useResizable from '@/Components/Nav/Tools/Logic/Actions/Resize-Bar';
export default function NullSidebar() {
  const { nullExpend, popupFolder, setNullExpend } = useFolderStore();
  const [animationDone, setAnimationDone] = useState(false);
      const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin
  } = useResizable();
  
  useEffect(() => {
    if (!nullExpend) setAnimationDone(false);
  }, [nullExpend]);

  return (
    <AnimatePresence>
      {nullExpend && (
        <motion.nav className="relative z-[1000]">
          {!animationDone ? (
            <motion.div
              ref={sidebarRef}
              key="null-sidebar"
              initial={{ width: 0 }}
              animate={{ width: 170 }}
              exit={{ width: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onAnimationComplete={() => setAnimationDone(true)}
              className={cn("bg-gray-800 h-screen overflow-y-auto relative")}
            />
          ) : (
            <motion.div
              exit={{ width: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative z-[1000] bg-gray-800 h-screen overflow-y-auto overflow-x-hidden"
            >
              <aside ref={sidebarRef} style={{ width: 170 }}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold">{popupFolder?.title || "Folder"}</h2>
                    <button onClick={() => setNullExpend(false)} className="text-red-500 text-sm">
                      Close
                    </button>
                  </div>
                  <NullFolder />
                </div>
              </aside>
              <ContextMenu />
            </motion.div>
          )}

       
          {/* Resize Handle */}
{animationDone && (
  <div
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
)}

        </motion.nav>
      )}
    </AnimatePresence>
  );
}
