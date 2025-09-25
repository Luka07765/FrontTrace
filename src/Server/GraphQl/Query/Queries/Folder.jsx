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
        tags {
          id
          title
          color
          iconId
        }
      }
    }
  }
`;

