import { useFolderStore } from '@/Zustand/Folder_Store';
import {useState} from "react"
import FileRender from '@/Components/Navigator/Tools/FileLogic/File_Render';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import CreateFolder from './FolderLogic/Create_Folder';
import Structure from './FolderLogic/Structure';
import { motion, AnimatePresence } from 'framer-motion';
export const Basic = ({ folders }) => {
  const { expandedFolders, creatingFolderParentId } = useFolderStore();
   const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
    const { handleUpdateFile } = useFileListLogic();
    const handleDrop = async (files, folderId) => {
    if (draggingIndex === null || dragOverIndex === null) return;

    const reordered = [...files].sort((a, b) => a.filePosition - b.filePosition);
    const [movedFile] = reordered.splice(draggingIndex, 1);
    reordered.splice(dragOverIndex, 0, movedFile);

    setDraggingIndex(null);
    setDragOverIndex(null);

    // Assign new positions based on the new order
    for (let i = 0; i < reordered.length; i++) {
      const updatedPos = i + 1;
      if (reordered[i].filePosition !== updatedPos) {
        await handleUpdateFile({ id: reordered[i].id, filePosition: updatedPos });
      }
    }
  };
  return (
    <ul>
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const hasChildren = folder.children && folder.children.length > 0;

        const isCreatingChild = creatingFolderParentId === folder.id;

        return (
          <li
            key={folder.id}
            className={`relative ${
              isExpanded
                ? 'before:content-[""] before:absolute before:left-[15.70px] before:top-[38px] before:bottom-0 before:w-[0.750px] before:bg-gray-200'
                : ''
            }`}
          >
            <Structure folder={folder} />

        <AnimatePresence initial={false}>
             {isExpanded && (
                       <motion.div
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         transition={{ duration: 0.25, ease: 'easeInOut' }}
                       >
                         {folder.files.length > 0 && (
                           <ul className="ml-8">
                             {folder.files
                               .slice()
                               .sort((a, b) => a.filePosition - b.filePosition)
                               .map((file, index) => (
                                 <FileRender
                                   key={file.id}
                                   file={file}
                                   index={index}
                                   onDragStart={(i) => setDraggingIndex(i)}
                                   onDragEnter={(i) => setDragOverIndex(i)}
                                   onDragEnd={() => handleDrop(folder.files, folder.id)}
                                 />
                               ))}
                           </ul>
                         )}
       
                         {hasChildren && (
                           <div className="ml-4">
                             <Basic folders={folder.children} />
                           </div>
                         )}
       
                         {isCreatingChild && (
                           <div className="ml-10">
                             <CreateFolder parentId={folder?.id} />
                           </div>
                         )}
                       </motion.div>
                     )}                 
           </AnimatePresence>



          </li>
        );
      })}

      {creatingFolderParentId === null && (
        <li>
          <CreateFolder parentId={null} />
        </li>
      )}
    </ul>
  );
};
