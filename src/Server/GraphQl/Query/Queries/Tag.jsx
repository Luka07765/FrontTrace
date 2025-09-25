import { gql } from '@apollo/client';

// --------------------- Queries ---------------------
export const GET_TAGS = gql`
  query GetTags {
    getTags {
      id
      title
      color
      iconId
    }
  }
`;

export const GET_TAG_Files = gql`
  query GET_TAG_Files($id: UUID!) {
    getTagFiles(id: $id) {
      id
      title
      color
      iconId
      tagAssignments {
        file {
          id
          title
        }
      }
    }
  }
`;




export const GET_FILES_BY_TAG = gql`
  query GetFilesByTag($tagId: ID!) {
    getFilesByTag(tagId: $tagId) {
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
