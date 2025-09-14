// update.js
export async function updateFilePositions(files, folderId, handleUpdateFile) {
  const sameFolderFiles = files.filter(f => f.folderId === folderId);

  for (let i = 0; i < sameFolderFiles.length; i++) {
    const updatedPos = i + 1; 
    const file = sameFolderFiles[i];

    if (file.filePosition !== updatedPos) {
      try {
        await handleUpdateFile({ id: file.id, filePosition: updatedPos });
        file.filePosition = updatedPos;
      } catch (err) {
        console.error(`Error updating file ${file.id}:`, err);
      }
    }
  }
}
