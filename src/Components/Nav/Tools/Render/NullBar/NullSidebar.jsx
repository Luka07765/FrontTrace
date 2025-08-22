'use client';

import FileRender from '@/Components/Nav/Tools/Render/FileAndFolder/File';
import { Main_Render } from '@/Components/Nav/Tools/Render/Main_Render';
import ContextMenu from '@/app/notebook/main/tools/ContextMenu/Context_Ui';
import { useFolderStore } from '@/Zustand/Folder_Store';
export default function Dashboard() {
    const {
        popupFolder,
    } = useFolderStore();

  return (
    <div>  
  {popupFolder?.children?.length > 0 ? (
    <Main_Render folders={popupFolder.children} />
  ) : (
    <p>No subfolders</p>
  )}
  {popupFolder?.files?.length > 0 && (
    <ul className="mt-4">
      {popupFolder.files
        .slice()
        .sort((a, b) => a.filePosition - b.filePosition)
        .map((file, index) => (
                  <FileRender
                          key={file.id}
                          file={file}
                          index={index}
                          folder={popupFolder}
              
 
                        />
        ))}
    </ul>
  )}
        <ContextMenu />

    </div>
  );
}
