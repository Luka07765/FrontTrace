import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  dragIdx: null,
  dragOver: null,



  editFileName: '',
  editFileContent: '',
  editFileId: '',

  moveData: [],       
  setMoveData: (data) => set({ moveData: data }),
  setDragIdx: (index) => set({ dragIdx: index }),
  setDragOver: (index) => set({ dragOver: index }),
  
  setEditFileId: (id) => set({ editFileId: id }),

  
  setEditFileName: (name) => set({ editFileName: name }),
  setEditFileContent: (content) => set({ editFileContent: content }),

 
  fileList: [],
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
