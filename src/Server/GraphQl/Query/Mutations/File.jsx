import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
export const CREATE_FILE = gql`
  mutation CreateFile($input: CreateFileInput!) {
    createFile(input: $input) {
      id
      title
      content
      folderId
      colors
      filePosition
      iconId 
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($id: UUID!) {
    deleteFile(id: $id)
  }
`;

export const UPDATE_FILE = gql`
  mutation UpdateFile($id: UUID!, $input: UpdateFileInput!) {
    updateFile(id: $id, input: $input) {
      id
      title
      content
      folderId
      colors
      filePosition
      iconId
    }
  }
`;
export const useCreateFile = () => {
  return useMutation(CREATE_FILE);
};

// Delete file
export const useDeleteFile = () => {
  return useMutation(DELETE_FILE);
};

// Update file
export const useUpdateFile = () => {
  return useMutation(UPDATE_FILE);
};
