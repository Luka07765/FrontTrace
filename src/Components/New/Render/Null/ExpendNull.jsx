import { motion } from "framer-motion";
import { cn } from "@/Utils/cn";

export default function ExpandingSidebar({ onAnimationComplete }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 170 }}

      transition={{ type: "spring", damping: 20 }}
      onAnimationComplete={onAnimationComplete}
      className={cn("bg-gray-800 h-screen overflow-y-auto relative")}
    />
  );
}
