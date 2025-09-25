import { useQuery, useMutation } from '@apollo/client';
import {

  CREATE_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  ASSIGN_TAG_TO_FILE,
  REMOVE_TAG_FROM_FILE,
} from '../Queries/TagQueries';

// Fetch all tags

// Create tag
export const useCreateTag = () => useMutation(CREATE_TAG);

// Update tag
export const useUpdateTag = () => useMutation(UPDATE_TAG);

// Delete tag
export const useDeleteTag = () => useMutation(DELETE_TAG);

// Assign tag to file
export const useAssignTagToFile = () => useMutation(ASSIGN_TAG_TO_FILE);

// Remove tag from file
export const useRemoveTagFromFile = () => useMutation(REMOVE_TAG_FROM_FILE);
