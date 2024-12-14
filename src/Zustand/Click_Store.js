import { create } from 'zustand';

export const Click = create((set) => ({
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

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
  handleCreateClick: (selectedFolderId) => {
    setFolderName('');
    if (selectedFolderId) {
      setCreatingFolderParentId(selectedFolderId);
    } else {
      setCreatingFolderParentId(null);
    }
  },
}));
