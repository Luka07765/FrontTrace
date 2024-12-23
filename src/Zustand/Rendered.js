import { create } from 'zustand';

export const Render = create((set) => ({
  folder: [],
  setFolder: (newFolders) => set({ folders: newFolders }),

  file: [],
  setFile: (newFolders) => set({ folders: newFolders }),
}));
