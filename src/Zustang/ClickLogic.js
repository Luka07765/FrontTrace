import { create } from 'zustand';

export const Click = create((set, get) => ({
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

  showEdit: false,
  setShowEdit: (editMode) => set({ showEdit: editMode }),

  showCreate: false,
  setShowCreate: (createMode) => set({ showCreate: createMode }),

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

  resetModalState: () => {
    set({
      showCreate: false,
      showEdit: false,
      folderName: '',
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
      contextMenuVisible: false,
      showCreate: true,
    });
  },

  handleRename: (folders) => {
    const {
      selectedFolderId,
      setShowEdit,
      setContextMenuVisible,
      setFolderName,
    } = get();

    const folderToEdit = folders.find((f) => f.id === selectedFolderId);

    if (folderToEdit) {
      setFolderName(folderToEdit.title);

      setShowEdit(true);
    } else {
      console.error('Folder to edit not found');
    }

    setContextMenuVisible(false);
  },

  submitCreate: (handleCreateFolder) => {
    const { folderName, selectedFolderId, resetModalState } = get();

    handleCreateFolder({
      title: folderName,
      parentFolderId: selectedFolderId, // Create under selected folder
    });

    resetModalState(); // Optionally reset modal state after creation
  },

  submitEdit: (handleUpdateFolder) => {
    const { selectedFolderId, folderName, resetModalState } = get();

    // Rename operation
    handleUpdateFolder({
      id: selectedFolderId,
      title: folderName,
      // Do not include parentFolderId to prevent unintended changes
    });

    resetModalState();
  },
}));
