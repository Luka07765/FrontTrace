import { create } from 'zustand';

export const useSelectStore = create((set) => ({
  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

  editFileId: null,
  setEditFileId: (id) => set({ editFileId: id }),


  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
