export function buildNestedStructure(folders, files) {
  const folderMap = {};

  folders.forEach((folder) => {
    folderMap[folder.id] = {
      ...folder,
      children: [],
      files: [],
    };
  });

  if (Array.isArray(files)) {
    files.forEach((file) => {
      const f = folderMap[file.folderId];
      if (f) {
        f.files.push(file);
      }
    });
  }

  Object.values(folderMap).forEach((f) => {
    f.files.sort((a, b) => (a.filePosition ?? 0) - (b.filePosition ?? 0));
  });

  const nested = [];
  folders.forEach((folder) => {
    const parentId =
      folder.parentFolderId === 'None' || folder.parentFolderId === null
        ? null
        : folder.parentFolderId;
    if (parentId && folderMap[parentId]) {
      folderMap[parentId].children.push(folderMap[folder.id]);
    } else {
      nested.push(folderMap[folder.id]);
    }
  });

  return nested;
}
