'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Dashboard() {

  const [collapsed, setCollapsed] = useState(false);



  return (
    <div
      className="relative flex h-screen overflow-hidden"
    >

      <motion.div
        animate={{ width: collapsed ? '5rem' : '16rem' }}
        transition={{ type: 'spring', damping: 15 }}
        className="h-full bg-gray-900 text-white flex flex-col items-center py-4"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          {collapsed ? '▶' : '◀'}
        </button>

  
      </motion.div>


    </div>
  );
}
