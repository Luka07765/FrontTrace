import Image from 'next/image';
import { motion } from 'framer-motion';
import Bad from "@/assets/FolderFile_Icons/unlike.png";
import checked from "@/assets/FolderFile_Icons/checked.png";
import Warning from "@/assets/FolderFile_Icons/warning-sign.png";
import React from 'react';
// Helper component for icon with count
const IconWithCount = ({ src, alt, count, colorClass, imageClass, spanClass }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="flex-shrink-0"
  >
    <Image src={src} alt={alt} width={11} height={11} className={imageClass} />
    {count > 0 && <span className={`${colorClass} text-[11px] ${spanClass}`}>{count}</span>}
  </motion.div>
);

export const UiColors = React.memo(function UiColors({ redCount, yellowCount }) {
  // Display checked icon if no red or yellow counts
  if (redCount === 0 && yellowCount === 0) {
    return (
      <Image
        src={checked}
        alt="Checked Icon"
        width={15}
        height={15}
        className="translate-x-1/2 -translate-y-1/2"
      />
    );
  }

  return (
    <>
      {/* Red icon */}
      {redCount > 0 && (
        <IconWithCount
          src={Bad}
          alt="Red Icon"
          count={redCount}
          colorClass="text-red-300"
          imageClass="translate-x -translate-y-1.5"
          spanClass="left-0 top-0 translate-x-2 -translate-y-3.5"
        />
      )}

      {/* Yellow icon when no red */}
      {yellowCount > 0 && redCount === 0 && (
        <IconWithCount
          src={Warning}
          alt="Yellow Icon"
          count={yellowCount}
          colorClass="text-yellow-300"
          imageClass="translate-x -translate-y-1.5"
          spanClass="left-0 top-0 translate-x-2 -translate-y-3.5"
        />
      )}

      {/* Yellow icon when red exists */}
      {yellowCount > 0 && redCount > 0 && (
        <IconWithCount
          src={Warning}
          alt="Yellow Icon"
          count={yellowCount}
          colorClass="text-yellow-300"
          imageClass=""
          spanClass="left-0 top-0 translate-x-2 -translate-y-2"
        />
      )}
    </>
  );
}
)