import { create } from 'zustand';

export const Click = create((set, get) => ({
  // State variables
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

  modalVisible: false,
  setModalVisible: (isVisible) => set({ modalVisible: isVisible }),

  modalTitle: '',
  setModalTitle: (title) => set({ modalTitle: title }),

  isEditMode: false,
  setIsEditMode: (editMode) => set({ isEditMode: editMode }),

  folderName: '',
  setFolderName: (name) => set({ folderName: name }),

  resetModalState: () => {
    set({
      modalVisible: false,
      folderName: '',
      isEditMode: false,
      selectedFolderId: null,
      // Removed parentFolderId from reset
    });
  },

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

  handleRename: (folders) => {
    const {
      selectedFolderId,
      setModalTitle,
      setIsEditMode,
      setModalVisible,
      setContextMenuVisible,
      setFolderName,
    } = get();

    const folderToEdit = folders.find((f) => f.id === selectedFolderId);

    if (folderToEdit) {
      setFolderName(folderToEdit.title); // Set the folder name in the modal
      setModalTitle('Edit Folder');
      setIsEditMode(true);
      setModalVisible(true);
    } else {
      console.error('Folder to edit not found');
    }

    setContextMenuVisible(false);
  },

  handleSubmit: (handleCreateFolder, handleUpdateFolder) => {
    const { isEditMode, selectedFolderId, folderName, resetModalState } = get();

    if (isEditMode) {
      // Rename operation
      handleUpdateFolder({
        id: selectedFolderId,
        title: folderName,
        // Do not include parentFolderId to prevent unintended changes
      });
    } else {
      // Create operation
      handleCreateFolder({
        title: folderName,
        parentFolderId: selectedFolderId, // Create under selected folder
      });
    }

    resetModalState();
  },
}));
