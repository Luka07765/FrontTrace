// folderUtils.js
export const handleCreate =
  ({
    folderName,
    setCreatingFolderParentId,
    setFolderName,
    handleCreateFolder,
  }) =>
  (parentFolderId) => {
    if (folderName.trim() !== '') {
      handleCreateFolder({ title: folderName.trim(), parentFolderId });
    }
    setCreatingFolderParentId(undefined); // Reset to undefined
    setFolderName('');
  };
