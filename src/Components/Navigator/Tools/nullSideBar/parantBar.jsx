'use client';

import { cn } from '@/Utils/cn';
import { ContextClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import { Basic } from '@/Components/Navigator/Tools/Basic_Render';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from '@/app/notebook/notes/tools/Resize-Bar';
import { useFolderStore } from '@/Zustand/Folder_Store';
import { useAuthCheck } from '@/app/notebook/notes/tools/Auth-Check';

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
 
    >   
      <aside

       
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
    </div>
  );
}
