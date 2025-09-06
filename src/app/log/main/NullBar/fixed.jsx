'use client';

import { useFolderStore } from '@/Zustand/Folder_Store';
import { useMoveLogic } from '@/Components/Nav/Actions/Move';
import FileRender from '@/app/log/main/FileAndFolder/File';
import CreateFolder from '@/Components/Nav/Actions/Create_Folder';
import Folder_Render from '@/app/log/main/FileAndFolder/Folder';

export default function NullSidebar({ nestedFolders }) {
  const { expandedFolders, creatingFolderParentId, popupFolder } = useFolderStore();
  const { folderDrop } = useMoveLogic();

  // find the specific folder that was clicked
  const targetFolder = findFolderById(nestedFolders, popupFolder?.id);

  if (!targetFolder) return null; // no folder selected

  return (
    <ul>
      <FolderContents
        folder={targetFolder}
        expandedFolders={expandedFolders}
        folderDrop={folderDrop}
        creatingFolderParentId={creatingFolderParentId}
      />
    </ul>
  );
}

// Renders the inside of a folder (files + children)
function FolderContents({ folder, expandedFolders, folderDrop, creatingFolderParentId }) {
  const hasChildren = folder.children && folder.children.length > 0;
  const hasFiles = folder.files.length > 0;

  return (
    <>
      {hasFiles && (
        <ul className="ml-4">
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

      {hasChildren && (
        <div className="ml-4">
          {folder.children.map(child => (
            <FolderNode
              key={child.id}
              folder={child}
              expandedFolders={expandedFolders}
              folderDrop={folderDrop}
              creatingFolderParentId={creatingFolderParentId}
            />
          ))}
        </div>
      )}

      {creatingFolderParentId === folder.id && (
        <div className="ml-4">
          <CreateFolder parentId={folder?.id} />
        </div>
      )}
    </>
  );
}

// Standard recursive folder renderer
function FolderNode({ folder, expandedFolders, folderDrop, creatingFolderParentId }) {
  const isExpanded = expandedFolders[folder.id];
  const hasChildren = folder.children && folder.children.length > 0;
  const hasFiles = folder.files.length > 0;
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
      <Folder_Render folder={folder} folderDrop={folderDrop} />

      {isExpanded && (
        <div>
          {hasFiles && (
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

          {hasChildren && (
            <div className="ml-9">
              {folder.children.map(child => (
                <FolderNode
                  key={child.id}
                  folder={child}
                  expandedFolders={expandedFolders}
                  folderDrop={folderDrop}
                  creatingFolderParentId={creatingFolderParentId}
                />
              ))}
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
}

// helper to find folder anywhere in nested structure
function findFolderById(folders, id) {
  if (!id || !folders) return null;
  for (const folder of folders) {
    if (folder.id === id) return folder;
    const found = findFolderById(folder.children, id);
    if (found) return found;
  }
  return null;
}
