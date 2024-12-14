import { create } from 'zustand';

export const Select = create((set) => ({
  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

  editFileId: null,
  setEditFileId: (id) => set({ editFileId: id }),
}));
