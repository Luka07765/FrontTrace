import { create } from 'zustand';

export const Click = create((set, get) => ({
  selectFileId: null,
  setSelectedFileId: (id) => set({ selectFileId }),
}));
