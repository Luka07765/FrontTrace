import Image from 'next/image';
import fileIcon from '@/assets/FolderFile_Icons/file.png';
import { useFileStore } from '@/Zustand/File_Store';

function FileRender({ file }) {
  const {
    editFileId,
    setEditFileId,
    setEditFileName,
    tabs,
    setTabs,
    setEditFileContent,
  } = useFileStore();

  const addFileTab = (newFile) => {
    if (!tabs.some((tab) => tab.fileId === newFile.fileId)) {
      setTabs([...tabs, newFile]);
    }
  };

  return (
    <div>
      <li
        key={file.id}
        onClick={(e) => {
          e.stopPropagation();
          addFileTab({ fileId: file.id, title: file.title });
          setEditFileId(file.id);
          setEditFileName(file.title);
          setEditFileContent(file.content);
        }}
        className={`bg-grey-800 shadow-md rounded-lg p-2 flex items-center justify-between cursor-pointer ${
          editFileId === file.id ? 'ring-2 ring-indigo-500' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          <Image
            src={fileIcon}
            alt="File Icon"
            width={20}
            height={20}
            className="filter invert"
          />
          <span className="text-left">{file.title + ''}</span>
          <span className="text-left">{'folderID+' + file.folderId}</span>
          <span className="text-left">{'=id+' + file.id}</span>
        </div>
      </li>
    </div>
  );
}

export default FileRender;
