'use client';
import { motion,  AnimatePresence } from 'framer-motion';
import {  useState } from 'react';
import { cn } from '@/Utils/cn';
import { ContextClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { Basic } from '@/Components/Navigator/Tools/Basic_Render';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from '@/app/notebook/notes/tools/Resize-Bar';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import ProjectLink from '@/Components/Navigator/Tools/Sectors/Projects';
import ProjectNavigation from '@/Components/Navigator/Tools/Sectors/ProjectNav';

export default function Dashboard() {
  const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin,
  } = useResizable();
    const {
        popupFolder, setNullExpend 
    } = useFolderStore();


  const { setContextMenuVisible } = ContextClick();
  const { cancelTokenRefresh } =
    useToken();


const loadingAuth = useAuthCheck(cancelTokenRefresh);






 if (loadingAuth) return <p>Loading...</p>;
  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >   {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          ' bg-gray-800 h-screen relative overflow-y-auto z-[1000]'
        )}
       
      >                  <div className="p-4">
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-lg font-bold">{popupFolder?.title || 'Folder'}</h2>
    <button onClick={() => setNullExpend(false)} className="text-red-500 text-sm">Close</button>
  </div>


  {popupFolder?.children?.length > 0 ? (
    <Basic folders={popupFolder.children} />
  ) : (
    <p>No subfolders</p>
  )}

  {popupFolder?.files?.length > 0 && (
    <ul className="mt-4">
      {popupFolder.files
        .slice()
        .sort((a, b) => a.filePosition - b.filePosition)
        .map((file, index) => (
          <li key={file.id} className="text-sm pl-2">
            {file.title}
          </li>
        ))}
    </ul>
  )}
</div>

      
        <ContextMenu />

      </aside>
       {/* Resize */}
      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0  cursor-ew-resize z-[1001] group"
        style={{
          width: `${1 + hitAreaMargin * 2}px`,
          left: sidebarRef.current
            ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px`
            : 260,
        }}
      >
        <div
          ref={resizerInnerRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0  bg-gray-600 transition-color duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
          style={{ left: `${hitAreaMargin}px` }}
        />
      </div>
       {/* Main Content */}
      <div
        ref={contentRef}
        style={{
          left: '260px',
          width: 'calc(100% - 280px)',
          overflow: 'auto',
        }}
      >
        <File />
      </div>

 


    </div>
  );
}
