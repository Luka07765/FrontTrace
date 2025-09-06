'use client';

import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Nav/Actions/Move';
import FileRender from '@/Components/Nav/Render/FileAndFolder/File';

import CreateFolder from '@/Components/Nav/Actions/Create_Folder';
import Folder_Render from '@/Components/Nav/Render/FileAndFolder/Folder';


import ContextMenu from '@/Components/Nav/Ui/ContextMenu/Context_Ui';

export default function NullSidebar({ nestedFolders }) {
  const { expandedFolders, creatingFolderParentId } = useFolderStore();
  const { folderDrop } = useMoveLogic();

  return (
    <ul>
      {nestedFolders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const folderExpend = folder.children && folder.children.length > 0;
        const isCreatingChild = creatingFolderParentId === folder.id;
        const filesExpend = folder.files.length > 0;

        return (
          <li
            key={folder.id}
            className={`relative ${
              isExpanded
                ? 'before:content-[""] before:absolute before:left-[15.70px] before:top-[38px] before:bottom-0 before:w-[0.750px] before:bg-gray-200'
                : ''
            }`}
          >
            <Folder_Render folder={folder} folderDrop={folderDrop} />

            {isExpanded && (
              <div>
                {filesExpend && (
                  <ul className="ml-12">
                    {folder.files
                      .slice()
                      .sort((a, b) => a.filePosition - b.filePosition)
                      .map((file, index) => (
                        <FileRender
                          key={file.id}
                          file={file}
                          index={index}
                          folder={folder}
                        />
                      ))}
                  </ul>
                )}

                {folderExpend && (
                  <div className="ml-9">
                    <NullSidebar nestedFolders={folder.children} />
                  </div>
                )}

                {isCreatingChild && (
                  <div className="ml-10">
                    <CreateFolder parentId={folder?.id} />
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

