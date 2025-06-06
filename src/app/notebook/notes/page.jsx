'use client';

import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { Basic } from '@/Components/Navigator/Basic_Render';
import CreateFolder from '@/Components/Navigator/Tools/FolderLogic/Create_Folder';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from './tools/Resize-Bar';
import { useLogout } from '@/Server/Auth/Logout';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';
import { buildNestedStructure } from '@/Utils/Data_Structure/Structure';
import {useMemo} from "react";
export default function Dashboard() {
 
  const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin,
  } = useResizable();
  const { files } = useFileListLogic();
  const { folders, loading, error } = useFolderListLogic();
  const { setContextMenuVisible } = RightClick();
  const { cancelTokenRefresh } = useToken();
  const { handleLogout } = useLogout();


const loadingAuth = useAuthCheck(cancelTokenRefresh);


const nestedFolders = useMemo(() => {
    return Array.isArray(folders) && folders.length > 0
      ? buildNestedStructure(folders, files)
      : null;
  }, [folders, files]);

 if (loadingAuth) return <p>Loading...</p>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading folders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading folders: {error.message}</p>
      </div>
    );
  }


  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      <aside
        ref={sidebarRef}
        className={cn(
          ' bg-gray-800  p-4 text-white h-screen relative overflow-y-auto z-[1000]'
        )}
        style={{ width: '280px' }}
      >
       
              {nestedFolders ? (
        <Basic folders={nestedFolders} />
      ) : (
        <div>
          {' '}
          <p className="text-gray-500">Create New Folder.</p>
          <CreateFolder parentId={null} />
        </div>
      )}
      
        <ContextMenu />
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </aside>

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
