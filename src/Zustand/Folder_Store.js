import { create } from 'zustand';

export const useFolderStore = create((set) => ({
  editingFolderId: null,
  setEditingFolderId: (id) => set({ editingFolderId: id }),

  creatingFolderParentId: undefined,
  setCreatingFolderParentId: (id) => set({ creatingFolderParentId: id }),

  folderName: '',
  setFolderName: (name) => set({ folderName: name }),

  expandedFolders: {},
  setExpandedFolders: (folderId) =>
    set((state) => ({
      expandedFolders: {
        ...state.expandedFolders,
        [folderId]: !state.expandedFolders[folderId],
      },
    })),

  handleDelete: (handleDeleteFolder, selectedFolderId) => {
    if (selectedFolderId) {
      handleDeleteFolder(selectedFolderId); // Execute delete
      set({ contextMenuVisible: false, selectedFolderId: null }); // Update state
    }
  },
}));
