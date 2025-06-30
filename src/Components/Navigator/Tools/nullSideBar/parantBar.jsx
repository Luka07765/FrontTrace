'use client';


import { Basic } from '@/Components/Navigator/Tools/Basic_Render';

import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';

import { useFolderStore } from '@/Zustand/Folder_Store';

export default function Dashboard() {

    const {
        popupFolder, setNullExpend 
    } = useFolderStore();



  return (
    <div>  
                
  <div >
    <h2 className="text-lg text-white font-bold">{popupFolder?.title}</h2>
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


      
        <ContextMenu />

    </div>
  );
}
