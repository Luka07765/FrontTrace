import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useFolderStore } from '@/Zustand/Folder_Store';

import Expend from "./Expend";
import Finished from "./Finished";

export default function NullSidebar() {
  const { nullExpend } = useFolderStore();
  const [animationDone, setAnimationDone] = useState(false);


  useEffect(() => {
    if (!nullExpend) setAnimationDone(false);
  }, [nullExpend]);

  return (
    <AnimatePresence>
      {nullExpend && (
       <motion.nav className="relative z-[1000]">

    {!animationDone ? (
      <Expend onAnimationComplete={() => setAnimationDone(true)} />
    ) : (
      <Finished />
    )}
</motion.nav>
      )}
    </AnimatePresence>
  );
}
