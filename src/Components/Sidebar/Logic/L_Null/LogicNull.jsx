'use client';

import { useFolderStore } from '@/Zustand/Old_Folder';
import { useMoveLogic } from '@/Components/Sidebar/Logic/Actions/Move';
import FileRender from '@/Components/Sidebar/Render/File';
import CreateFolder from '@/Components/Sidebar/Logic/Actions/Create_Folder';
import Folder_Render from '@/Components/Sidebar/Render/Folder';

export default function NullSidebar({ nestedFolders }) {
  const { expandedFolders, creatingFolderParentId, popupFolder } = useFolderStore();
  const { folderDrop } = useMoveLogic();

  const targetFolder = findFolderById(nestedFolders, popupFolder?.id);
  if (!targetFolder) return null;

  return (
    <ul>
      <FolderNode
        folder={targetFolder}
        expandedFolders={expandedFolders}
        folderDrop={folderDrop}
        creatingFolderParentId={creatingFolderParentId}
        root
      />
    </ul>
  );
}

function FolderNode({ folder, expandedFolders, folderDrop, creatingFolderParentId, root }) {
  const isExpanded = expandedFolders[folder.id];
  const isCreating = creatingFolderParentId === folder.id;
  const hasFiles = folder.files?.length > 0;
  const hasChildren = folder.children?.length > 0;

  return (
    <li
      key={folder.id}
      className={`relative ${isExpanded && !root
        ? 'before:content-[""] before:absolute before:left-[15.70px] before:top-[38px] before:bottom-0 before:w-[0.750px] before:bg-gray-200'
        : ''}`}
    >
      {!root && <Folder_Render folder={folder} folderDrop={folderDrop} />}

      {(root || isExpanded) && (
        <div className={root ? '' : 'ml-4'}>
          {hasFiles && (
            <ul className={root ? 'ml-4' : 'ml-8'}>
              {folder.files
                .slice()
                .sort((a, b) => a.filePosition - b.filePosition)
                .map((file, i) => (
                  <FileRender key={file.id} file={file} index={i} folder={folder} />
                ))}
            </ul>
          )}

 {hasChildren && (
  <ul className="ml-4">
    {folder.children.map(child => (
      <FolderNode
        key={child.id}
        folder={child}
        expandedFolders={expandedFolders}
        folderDrop={folderDrop}
        creatingFolderParentId={creatingFolderParentId}
      />
    ))}
  </ul>
)}
          {isCreating && <CreateFolder parentId={folder.id} />}
        </div>
      )}
    </li>
  );
}


function findFolderById(folders, id) {
  if (!id || !folders) return null;
  for (const f of folders) {
    if (f.id === id) return f;
    const found = findFolderById(f.children, id);
    if (found) return found;
  }
  return null;
}
