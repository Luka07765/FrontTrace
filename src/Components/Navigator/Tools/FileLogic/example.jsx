import React from 'react';
import Image from 'next/image';
import fileIcon from '@/assets/file.png';
import { useFileStore } from '@/Zustand/File_Store';
import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
function Example({ file, folder }) {
  const {
    editFileId,
    setEditFileId,
    setFileName,
    setFolderId,
    setFileContent,

    setEditFileName,

    setEditFileContent,
  } = useFileStore();

  return (
    <div>
      <li
        key={file.id}
        onClick={(e) => {
          e.stopPropagation();

          setFileName(file.title);
          setFileContent(file.content);

          setEditFileId(file.id);
          setEditFileName(file.title);
          setEditFileContent(file.content);
          setFolderId(folder.id);
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

export default Example;
