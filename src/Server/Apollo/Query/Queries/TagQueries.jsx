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

export const GET_TAG_BY_ID = gql`
  query GetTagById($id: UUID!) {
    getTagById(id: $id) {
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


// --------------------- Mutations ---------------------
export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      title
      color
      iconId
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($input: UpdateTagInput!) {
    updateTag(input: $input) {
      id
      title
      color
      iconId
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: UUID!) {
    deleteTag(id: $id)
  }
`;

export const ASSIGN_TAG_TO_FILE = gql`
  mutation AssignTagToFile($input: AssignTagInput!) {
    assignTagToFile(input: $input)
  }
`;

export const REMOVE_TAG_FROM_FILE = gql`
  mutation RemoveTagFromFile($input: AssignTagInput!) {
    removeTagFromFile(input: $input)
  }
`;
