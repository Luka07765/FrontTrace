
export const transformStructure = (folder) => ({
  name: folder.title || folder.name,
  filesCount: folder.files?.length || 0,
  subfoldersCount: folder.children?.length || 0,
  children: [
    ...(folder.files || []).map((file) => ({
      name: file.title,
      filesCount: 0,
      subfoldersCount: 0,
      children: [],
            tags: (file.tags || []).map(tag => ({
        id: tag.id,
        title: tag.title,
        color: tag.color || "#bb1010ff",
      })),
    })),
    ...(folder.children || []).map((child) => transformStructure(child)),
  ],
});
