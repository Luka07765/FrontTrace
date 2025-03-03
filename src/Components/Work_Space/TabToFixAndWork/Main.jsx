import * as React from 'react';
import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { TabSystem } from './Tab_System';
import { AddIcon } from './Icons/AddIcon';
import { useFileStore } from '@/Zustand/File_Store';
import { allIngredients, getNextIngredient } from './other/ingridiants';
import { removeItem, closestItem } from '@/Utils/Tab_Logic';

export default function App() {
  const { tabs, setTabs } = useFileStore();
  const [selectedTab, setSelectedTab] = useState(tabs);
  const remove = (item) => {
    if (item === selectedTab) {
      setSelectedTab(closestItem(tabs, item));
    }

    setTabs(removeItem(tabs, item));
  };

  const add = () => {
    const nextItem = getNextIngredient(tabs);

    if (nextItem) {
      setTabs([...tabs, nextItem]);
      setSelectedTab(nextItem);
    }
  };

  return (
    <div className="w-[480px] h-[360px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <nav className="p-1 pt-0 border-b border-gray-200 h-11 grid grid-cols-[1fr_35px]">
        <Reorder.Group
          as="ul"
          axis="x"
          onReorder={setTabs}
          className="flex justify-start items-end flex-nowrap pr-2 space-x-2 w-[420px]"
          values={tabs}
        >
          <AnimatePresence initial={false}>
            {tabs.map((tab) => (
              <TabSystem
                key={tab.fileId}
                item={tab}
                isSelected={selectedTab === tab}
                onClick={() => {
                  setSelectedTab(tab);
                  console.log(tab + 'ovo je tab');
                }}
                onRemove={() => remove(tab)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <motion.button
          className="w-8 h-8 bg-gray-200 rounded-full disabled:opacity-40 disabled:cursor-default flex items-center justify-center"
          onClick={add}
          disabled={tabs.length === allIngredients.length}
          whileTap={{ scale: 0.9 }}
        >
          <AddIcon />
        </motion.button>
      </nav>
      <main className="flex justify-center items-center flex-grow text-8xl select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : 'empty'}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            {selectedTab ? selectedTab.icon : '😋'}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
