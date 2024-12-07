import { create } from 'zustand';

const useFileStore = create((set) => ({
  editFileId: null,
  setEditFileId: (id) => set({ editFileId: id }),

  fileName: '',
  setFileName: (name) => set({ fileName: name }),

  fileContent: '',
  setFileContent: (content) => set({ fileContent: content }),

  folderId: '',
  setFolderId: (id) => set({ folderId: id }),

  editFileName: '',
  setEditFileName: (name) => set({ editFileName: name }),

  editFileContent: '',
  setEditFileContent: (content) => set({ editFileContent: content }),
}));

export default useFileStore;
