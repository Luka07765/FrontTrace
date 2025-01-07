export const handleFileSelect = (
  file,
  addFileTab,
  setEditFileId,
  setEditFileName,
  setEditFileContent
) => {
  addFileTab({ fileId: file.id, title: file.title });
  setEditFileId(file.id);
  setEditFileName(file.title);
  setEditFileContent(file.content);
};
