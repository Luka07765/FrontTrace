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
  folderName: '', // Add folderName to the store
  setFolderName: (name) => set({ folderName: name }),

  resetModalState: () => {
    set({
      modalVisible: false,
      folderName: '',
      parentFolderId: null,
      isEditMode: false,
      selectedFolderId: null,
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

  // Add handleRename function
  handleRename: (folders, setFolderName) => {
    const {
      selectedFolderId,
      setParentFolderId,
      setModalTitle,
      setIsEditMode,
      setModalVisible,
      setContextMenuVisible,
    } = get();

    const folderToEdit = folders.find((f) => f.id === selectedFolderId);
    if (folderToEdit) {
      setFolderName(folderToEdit.title); // Local state
      setParentFolderId(folderToEdit.parentFolderId);
      setModalTitle('Edit Folder');
      setIsEditMode(true);
      setModalVisible(true);
    }
    setContextMenuVisible(false);
  },
  handleSubmit: (handleCreateFolder, handleUpdateFolder) => {
    const {
      isEditMode,
      selectedFolderId,
      folderName,
      parentFolderId,
      resetModalState,
    } = get();

    if (isEditMode) {
      handleUpdateFolder({
        id: selectedFolderId,
        title: folderName,
        parentFolderId: parentFolderId,
      });
    } else {
      handleCreateFolder({
        title: folderName,
        parentFolderId: selectedFolderId, // Create under selected folder
      });
    }
    resetModalState();
  },
}));
