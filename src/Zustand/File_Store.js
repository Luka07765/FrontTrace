import { create } from 'zustand';

export const useFileStore = create((set, get) => ({


  //MOVE LOGIC
  dragIdx: null,
  dragOver: null,
  moveData: [],    
     
  setMoveData: (data) => set({ moveData: data }),
  setDragIdx: (index) => set({ dragIdx: index }),
  setDragOver: (index) => set({ dragOver: index }),



  //GENERAL FILE
  
  editFileId: '',
  setEditFileId: (id) => set({ editFileId: id }),

  editFileName: '',
  editFileContent: '',
 

  setEditFileName: (name) => set({ editFileName: name }),
  setEditFileContent: (content) => set({ editFileContent: content }),

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
