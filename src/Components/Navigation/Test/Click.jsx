import React from 'react';

export const ContextMenu = ({
  isVisible,
  position,
  onCreate,
  onRename,
  onDelete,
}) => {
  if (!isVisible) return null;

  return (
    <ul
      className="absolute bg-black border rounded shadow-md z-50"
      style={{
        top: position.y,
        left: position.x,
        position: 'fixed',
      }}
    >
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={onCreate}
      >
        Create Folder
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={onRename}
      >
        Rename Folder
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={onDelete}
      >
        Delete Folder
      </li>
    </ul>
  );
};

export default ContextMenu;
