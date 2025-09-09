import { gql } from '@apollo/client';

export const GET_FOLDERS = gql`
  query GetFolders {
    getFolders {
      id
      title
      parentFolderId
      iconId
      
      files {
        id
        title
        content
        folderId
        colors
        filePosition
        iconId 
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

export const GET_FILES = gql`
  query GetFiles {
    getFiles {
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
