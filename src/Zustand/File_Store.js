import { create } from 'zustand';

export const useFileStore = create((set) => ({
  fileName: '',
  fileContent: '',
  folderId: '',
  editFileName: '',
  editFileContent: '',
  editFileId: null,
  setEditFileId: (id) => set({ editFileId: id }),
  setFileName: (name) => set({ fileName: name }),
  setFileContent: (content) => set({ fileContent: content }),
  setFolderId: (id) => set({ folderId: id }),
  setEditFileName: (name) => set({ editFileName: name }),
  setEditFileContent: (content) => set({ editFileContent: content }),

  // Action to reset the edit state
  resetEditState: () =>
    set({
      editFileId: null,
      editFileName: '',
      editFileContent: '',
      folderId: '',
    }),
}));
