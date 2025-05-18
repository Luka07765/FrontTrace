export function buildNestedStructure(folders) {
  const folderMap = {};

  folders.forEach((folder) => {
    const sortedFiles = folder.files
      ? [...folder.files].sort((a, b) => (a.filePosition ?? 0) - (b.filePosition ?? 0))
      : [];

    folderMap[folder.id] = {
      ...folder,
      children: [],
      files: sortedFiles,
    };
  });

  const nested = [];
  folders.forEach((folder) => {
    const parentFolderId =
      folder.parentFolderId === 'None' || folder.parentFolderId === null
        ? null
        : folder.parentFolderId;

    if (parentFolderId === null) {
      nested.push(folderMap[folder.id]);
    } else if (folderMap[parentFolderId]) {
      folderMap[parentFolderId].children.push(folderMap[folder.id]);
    }
  });

  return nested;
}
