import { create } from 'zustand';

export const useData = create((set, get) => ({
  dataFolders: [],
  dataFiles: [],

  setDataFolders: (newFolders) => set({ dataFolders: newFolders }),
  setDataFiles: (newFiles) => set({ dataFiles: newFiles }),

  addFolder: (folder) => set(state => ({ dataFolders: [...state.dataFolders, folder] })),
  updateFolder: (id, updatedData) =>
    set(state => ({
      dataFolders: state.dataFolders.map(f => f.id === id ? { ...f, ...updatedData } : f)
    })),
  deleteFolder: (id) =>
    set(state => ({ dataFolders: state.dataFolders.filter(f => f.id !== id) })),

  addFile: (file) => set(state => ({ dataFiles: [...state.dataFiles, file] })),
  updateFile: (id, updatedData) =>
    set(state => ({
      dataFiles: state.dataFiles.map(f => f.id === id ? { ...f, ...updatedData } : f)
    })),
  deleteFile: (id) =>
    set(state => ({ dataFiles: state.dataFiles.filter(f => f.id !== id) })),
}));
