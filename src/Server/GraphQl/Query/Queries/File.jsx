import { gql } from '@apollo/client';


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
          tags {
      id
      title
      color
      iconId
    }
    }
  }
`;export const GET_FILE_BY_ID = gql`
  query GetFileById($id: UUID!) {
    getFileById(id: $id) {
      id
      title
      content
      folderId
      colors
      filePosition
      iconId
      tags {
        id
        title
        color
        iconId
      }
    }
  }
`;
