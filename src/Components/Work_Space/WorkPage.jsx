import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useState, useEffect } from 'react';
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
  const saveTimeout = useRef(null);
  const contentEditableRef = useRef(null);
  const isUserInput = useRef(false);

  useEffect(() => {
    if (contentEditableRef.current && !isUserInput.current) {
      contentEditableRef.current.innerHTML = editFileContent;
    }
    isUserInput.current = false;
  }, [editFileContent]);

  const handleDebouncedUpdate = (value, setter, immediate = false) => {
    setter(value);
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(
      () => {
        snapshot();
        handleSubmitUpdate(handleUpdateFile);
      },
      immediate ? 0 : 2000
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        {editFileId && (
          <>
            <nav className="p-1 pt-0 border-b border-gray-200 h-11 grid grid-cols-[1fr_35px]">
              <Reorder.Group
                as="ul"
                axis="x"
                onReorder={setTabs}
                className="flex  justify-start items-end flex-nowrap pr-2 space-x-2 w-full"
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
                onChange={(e) =>
                  handleDebouncedUpdate(e.target.value, setEditFileName, true)
                }
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="contenteditable-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <div
                  ref={contentEditableRef}
                  contentEditable={true}
                  onInput={(e) => {
                    isUserInput.current = true;
                    const html = e.currentTarget.innerHTML;
                    handleDebouncedUpdate(html, setEditFileContent);
                  }}
                  className="content-editable w-full h-screen text-white bg-[#12131c] px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
                  placeholder="File Content"
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
