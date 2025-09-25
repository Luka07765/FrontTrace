import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';


export const CREATE_FOLDER = gql`
  mutation CreateFolder($input: FolderInput!) {
    createFolder(input: $input) {
      id
      title
      parentFolderId
      iconId
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation DeleteFolder($id: UUID!) {
    deleteFolder(id: $id)
  }
`;

export const UPDATE_FOLDER = gql`
  mutation UpdateFolder($id: UUID!, $input: FolderInput!) {
    updateFolder(id: $id, input: $input) {
      id
      title
      parentFolderId
      iconId
    }
  }
`;
export const useCreateFolder = () => {
  return useMutation(CREATE_FOLDER);
};

// Delete folder
export const useDeleteFolder = () => {
  return useMutation(DELETE_FOLDER);
};

// Update folder
export const useUpdateFolder = () => {
  return useMutation(UPDATE_FOLDER);
};