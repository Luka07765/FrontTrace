import Image from 'next/image';
import fileIcon from '@/assets/FolderFile_Icons/file.png';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
function FileRender({ file }) {
  const {
    editFileId,
    setEditFileId,
    setEditFileName,
 
    setEditFileContent,
  } = useFileStore();
    const { handleUpdateFile } = useFileListLogic();

  const cycleColor = (c) => {
    const order = ['Green','Yellow','Red'];
    const i = order.indexOf(c);
    return order[(i + 1) % order.length];
  };
  
  const onColorClick = async (e) => {
    e.stopPropagation();
    const newColor = cycleColor(file.colors);
    try {
      await handleUpdateFile({ id: file.id, colors: newColor });

    } catch (err) {
      console.error('Failed to update color', err);
    }
  };
  
  const dotClass = {
    Red:    'bg-red-500',
    Yellow: 'bg-yellow-500',
    Green:  'bg-green-500',
  }[file.colors] || 'bg-gray-400';


  return (
    <div>
      <li
        key={file.id}
        onClick={(e) => {
          e.stopPropagation();
 
          setEditFileId(file.id);
          setEditFileName(file.title);
          setEditFileContent(file.content);
          
        }}
        className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
          editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
        }`}
      >     <span
      onClick={onColorClick}
      className={`w-[5px] h-[5px]  rounded-full cursor-pointer ${dotClass} absolute -translate-x-3 -translate-y-4`}
    />
        <div className="flex items-center space-x-2">
          <Image
            src={fileIcon}
            alt="File Icon"
            width={20}
            height={20}
            className="filter invert"
          />
          <span className="text-left">{file.title}</span>
        </div>
      </li>
    </div>
  );
}

export default FileRender;
