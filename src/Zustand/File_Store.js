import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  tabs: [],
  fileName: '',
  fileContent: '',
  folderId: '',
  editFileName: '',
  editFileContent: '',

  setTabs: (updatedTabs) => set({ tabs: updatedTabs }),
  setEditFileId: (id) => set({ editFileId: id }),
  setFileName: (name) => set({ fileName: name }),
  setFileContent: (content) => set({ fileContent: content }),
  setFolderId: (id) => set({ folderId: id }),

  setEditFileName: (name) => {
    set({
      editFileName: name,
      redoStack: [],
    });
  },

  setEditFileContent: (content) => {
    set({
      editFileContent: content,
      redoStack: [],
    });
  },

  handleSubmitUpdate: (handleUpdateFile) => {
    const { editFileId, editFileName, editFileContent, fileName, fileContent } =
      get();
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
