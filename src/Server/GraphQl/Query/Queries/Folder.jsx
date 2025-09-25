import { gql } from '@apollo/client';


export const GET_FOLDERS = gql`
  query GetFolders {
    getFolders {
      id
      title
      parentFolderId
      iconId
    }
  }
`;

