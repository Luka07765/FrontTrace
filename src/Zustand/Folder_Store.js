import { create } from 'zustand';

export const useFolderStore = create((set) => ({
  editingFolderId: null,
  dragFolder: null,
  moveFolder: null,
  creatingFolderParentId: undefined,
  folderName: '',
  expandedFolders: {},
    nullExpend: false,
popupFolder: null, // will store the folder object or folder.id
setNullExpend: (val) => set({ nullExpend: val }),
setPopupFolder: (folder) => set({ popupFolder: folder }),


 setEditingFolderId: (id) => set({ editingFolderId: id }),
  setMoveFolder: (id) => set({ moveFolder: id }),
  setDragFolder: (id) => set({ dragFolder: id }),
  setCreatingFolderParentId: (id) => set({ creatingFolderParentId: id }),
  setFolderName: (name) => set({ folderName: name }),
  
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
