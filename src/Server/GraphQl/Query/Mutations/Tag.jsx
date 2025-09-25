import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

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



export const useCreateTag = () => useMutation(CREATE_TAG);

// Update tag
export const useUpdateTag = () => useMutation(UPDATE_TAG);

// Delete tag
export const useDeleteTag = () => useMutation(DELETE_TAG);

// Assign tag to file
export const useAssignTagToFile = () => useMutation(ASSIGN_TAG_TO_FILE);

// Remove tag from file
export const useRemoveTagFromFile = () => useMutation(REMOVE_TAG_FROM_FILE);