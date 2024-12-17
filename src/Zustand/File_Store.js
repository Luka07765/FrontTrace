import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  fileName: '',
  fileContent: '',
  folderId: '',
  editFileName: '',
  editFileContent: '',
  editFileId: null,
  undoStack: [],
  redoStack: [],

  setEditFileId: (id) => set({ editFileId: id }),
  setFileName: (name) => set({ fileName: name }),
  setFileContent: (content) => set({ fileContent: content }),
  setFolderId: (id) => set({ folderId: id }),

  setEditFileName: (name) => {
    const { editFileName, editFileContent, undoStack } = get();
    set({
      editFileName: name,
      redoStack: [],
    });
  },

  setEditFileContent: (content) => {
    const { editFileName, editFileContent, undoStack } = get();

    set({
      editFileContent: content,
      redoStack: [],
    });
  },
  snapshot: () => {
    const { editFileName, editFileContent, undoStack } = get();

    set({
      undoStack: [...undoStack, { editFileName, editFileContent }],
    });
  },

  undo: () => {
    const { undoStack, redoStack, editFileName, editFileContent } = get();
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      set({
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, { editFileName, editFileContent }],
        editFileName: previousState.editFileName,
        editFileContent: previousState.editFileContent,
      });
    }
  },
  redo: () => {
    const { undoStack, redoStack, editFileName, editFileContent } = get();
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      set({
        undoStack: [...undoStack, { editFileName, editFileContent }],
        redoStack: redoStack.slice(0, -1),
        editFileName: nextState.editFileName,
        editFileContent: nextState.editFileContent,
      });
    }
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
