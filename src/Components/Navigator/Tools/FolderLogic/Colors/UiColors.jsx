// components/FolderStatusIcon.js
import Image from 'next/image';
import { motion } from 'framer-motion';
import Bad from "@/assets/FolderFile_Icons/unlike.png";
import checked from "@/assets/FolderFile_Icons/checked.png";
import Warning from "@/assets/FolderFile_Icons/warning-sign.png";

export default function UiColors({ redCount, yellowCount }) {
  if (redCount === 0 && yellowCount === 0) {
    return (
      <Image
        src={checked}
        alt="Checked Icon"
        width={11}
        height={11}
        className="absolute translate-x-1/2 -translate-y-1/2"
      />
    );
  }

  if (yellowCount > 0 && redCount > 0) {
    return (
      <motion.div 
        className="absolute translate-x-1/2 -translate-y-1/"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Image
          src={Warning}
          alt="Warning Icon"
          width={11}
          height={11}
        />
        <span className='text-yellow-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-2'>
          {yellowCount}
        </span>
      </motion.div>
    );
  }

  if (redCount > 0) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="absolute translate-x-1/2 -translate-y-1/"
      >
        <Image
          src={Bad}
          alt="Red Icon"
          width={11}
          height={11}
          className="translate-x -translate-y-1.5"
        />
        <span className="text-red-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-3.5">
          {redCount}
        </span>
      </motion.div>
    );
  }

  if (yellowCount > 0) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="absolute translate-x-1/2 -translate-y-1/"
      >
        <Image
          src={Warning}
          alt="Yellow Icon"
          width={11}
          height={11}
          className="translate-x -translate-y-1.5"
        />
        <span className="text-yellow-300 text-[11px] absolute left-0 top-0 translate-x-2 -translate-y-3.5">
          {yellowCount}
        </span>
      </motion.div>
    );
  }

  return null;
}
