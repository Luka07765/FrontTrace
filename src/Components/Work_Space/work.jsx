import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useEffect, useState } from 'react';
import { TabSystem } from './tools/Tab/Tab_System';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { AddIcon } from '@/Components/Work_Space/tools/Tab/Icons/AddIcon';
import { removeItem } from '@/Utils/Tab_Logic';

export default function FileList() {
  const { handleUpdateFile } = useFileListLogic();
  const {
    editFileId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
    handleSubmitUpdate,
    snapshot,
    undo,
    redo,
    tabs,
    setEditFileId,
    setTabs,
  } = useFileStore();
  const [selectedTab, setSelectedTab] = useState(tabs);

  const remove = (item) => {
    setTabs(removeItem(tabs, item));
  };

  // Auto save every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      snapshot(); // Take a snapshot before updating
      handleSubmitUpdate(handleUpdateFile); // Submit update
    }, 2000); // Save every 2 seconds

    // Cleanup interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []); // This only runs once when the component mounts

  return (
    <div className="p-10 ">
      <div className="w-[800px] h-screen bg-#12131c rounded-lg shadow-lg flex flex-col overflow-hidden">
        {editFileId && (
          <>
            <nav className="p-1 pt-0 border-b border-gray-200 h-11 grid grid-cols-[1fr_35px]">
              <Reorder.Group
                as="ul"
                axis="x"
                onReorder={setTabs}
                className="flex justify-start items-end flex-nowrap pr-2 space-x-2 w-full"
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
                        setEditFileId(tab.fileId);
                      }}
                      onRemove={() => remove(tab)}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>

              <motion.button
                className="w-8 h-8 bg-gray-200 rounded-full disabled:opacity-40 disabled:cursor-default flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                <AddIcon />
              </motion.button>
            </nav>

            <div>
              <input
                className="w-full px-4 py-2 text-white text-lg font-bold bg-[#12131c] focus:outline-none focus:border-transparent"
                type="text"
                placeholder="File Title"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="textarea-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <textarea
                  placeholder="File Content"
                  value={editFileContent}
                  onChange={(e) => setEditFileContent(e.target.value)}
                  className="w-full h-screen text-white bg-[#12131c] px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex space-x-2">
              <button onClick={undo} className="px-4 py-2 border rounded">
                Undo
              </button>
              <button onClick={redo} className="px-4 py-2 border rounded">
                Redo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
