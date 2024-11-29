import { create } from 'zustand';

export const Click = create((set, get) => ({
  // Existing state and actions
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

  parentFolderId: null, // Initial state
  setParentFolderId: (id) => set({ parentFolderId: id }),

  modalVisible: false,
  setModalVisible: (isVisible) => set({ modalVisible: isVisible }),

  modalTitle: '',
  setModalTitle: (title) => set({ modalTitle: title }),

  isEditMode: false,
  setIsEditMode: (editMode) => set({ isEditMode: editMode }),

  handleDelete: (handleDeleteFolder) => {
    const { selectedFolderId } = get();
    if (selectedFolderId) {
      handleDeleteFolder(selectedFolderId); // Execute delete
      set({ contextMenuVisible: false, selectedFolderId: null }); // Update state
    }
  },

  handleCreate: () => {
    set({
      modalTitle: 'Create Folder',
      isEditMode: false,
      modalVisible: true,
      contextMenuVisible: false,
    });
  },
}));
