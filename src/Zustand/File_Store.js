import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  dragIdx: null,
  dragOverIndex: null,
  fileName: '',
  fileContent: '',
  folderId: '',
  editFileName: '',
  editFileContent: '',
  editFileId: '',
  fileList: [],

  setDragIdx: (index) => set({ dragIdx: index }),
  setDragOver: (index) => set({ dragOverIndex: index }),
  
  setEditFileId: (id) => set({ editFileId: id }),
  setFileName: (name) => set({ fileName: name }),
  setFileContent: (content) => set({ fileContent: content }),
  setFolderId: (id) => set({ folderId: id }),
  setEditFileName: (name) => set({ editFileName: name }),
  setEditFileContent: (content) => set({ editFileContent: content }),

  resetDragState: () =>
    set({
      dragIdx: null,
      dragOverIndex: null,
    }),

  updateFileColor: (id, newColor) =>
    set((state) => ({
      fileList: state.fileList.map((file) =>
        file.id === id ? { ...file, colors: newColor } : file
      ),
    })),

  handleSubmitUpdate: (handleUpdateFile) => {
    const { editFileId, editFileName, editFileContent, fileName, fileContent } = get();
    const delta = { id: editFileId };

    if (editFileName !== fileName && editFileName.trim() !== '') {
      delta.title = editFileName;
    }
    if (editFileContent !== fileContent && editFileContent.trim() !== '') {
      delta.content = editFileContent;
    }

    console.log('Delta Object:', delta);
    const changedFields = Object.keys(delta).filter(
      (key) => key === 'title' || key === 'content'
    );

    if (changedFields.length > 0) {
      handleUpdateFile(delta);
      set({
        fileName: editFileName,
        fileContent: editFileContent,
      });
    }
  },
}));
