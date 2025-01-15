import { gql } from '@apollo/client';

export const GET_FOLDERS = gql`
  query GetFolders {
    getFolders {
      id
      title
      parentFolderId
      files {
        id
        title
        content
        folderId
      }
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation CreateFolder($input: FolderInput!) {
    createFolder(input: $input) {
      id
      title
      parentFolderId
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation DeleteFolder($id: Int!) {
    deleteFolder(id: $id)
  }
`;

export const UPDATE_FOLDER = gql`
  mutation UpdateFolder($id: Int!, $input: FolderInput!) {
    updateFolder(id: $id, input: $input) {
      id
      title
      parentFolderId
    }
  }
`;

export const GET_FILES = gql`
  query GetFiles {
    getFiles {
      id
      title
      content
      folderId
    }
  }
`;

export const CREATE_FILE = gql`
  mutation CreateFile($input: CreateFileInput!) {
    createFile(input: $input) {
      id
      title
      content
      folderId
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id)
  }
`;

export const UPDATE_FILE = gql`
  mutation UpdateFile($id: ID!, $input: UpdateFileInput!) {
    updateFile(id: $id, input: $input) {
      id
      title
      content
      folderId
    }
  }
`;
