import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useFolderStore } from '@/Zustand/Folder_Store';
import useResizable from '@/Components/Sidebar/Logic/Actions/Resize-Bar';
import ExpandingSidebar from "./ExpendNull";
import ExpandedSidebar from "./CollapseNull";

export default function NullSidebar() {
  const { nullExpend, setNullExpend } = useFolderStore();
  const [animationDone, setAnimationDone] = useState(false);

  const { sidebarRef, resizerRef, resizerInnerRef, handleMouseDown, hitAreaMargin } = useResizable();

  useEffect(() => {
    if (!nullExpend) setAnimationDone(false);
  }, [nullExpend]);

  return (
    <AnimatePresence>
      {nullExpend && (
        <motion.nav className="relative z-[1000]">
          {!animationDone ? (
            <ExpandingSidebar onAnimationComplete={() => setAnimationDone(true)} />
          ) : (
            <ExpandedSidebar
              sidebarRef={sidebarRef}
              resizerRef={resizerRef}
              resizerInnerRef={resizerInnerRef}
              handleMouseDown={handleMouseDown}
              hitAreaMargin={hitAreaMargin}
              setNullExpend={setNullExpend}
            />
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
