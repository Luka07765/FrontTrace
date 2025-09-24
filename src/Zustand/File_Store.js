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
  
  fileId: '',
  setFileId: (id) => set({ fileId: id }),

  editFileName: '',
  editFileContent: '',
 

  setEditFileName: (name) => set({ editFileName: name }),
  setEditFileContent: (content) => set({ editFileContent: content }),


   //                          FUNCTIONS

  handleSubmitUpdate: (handleUpdateFile) => {
    const { fileId, editFileName, editFileContent, fileName, fileContent } = get();
    const delta = { id: fileId };

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

    handleFileClick: (file, getHasTyped, saveNow) => {
    if (getHasTyped()) {
      saveNow(); 
    }

    set({
      fileId: file.id,
      editFileName: file.title,
      editFileContent: file.content,
    });
  },
}));
// handleFileClick: async (fileId, getHasTyped, saveNow, apolloClient) => {
//   if (getHasTyped()) {
//     saveNow();
//   }

//   const { data } = await apolloClient.query({
//     query: GET_FILE_BY_ID,
//     variables: { id: fileId }
//   });

//   set({
//     fileId: data.getFileById.id,
//     editFileName: data.getFileById.title,
//     editFileContent: data.getFileById.content,
//   });
// };
