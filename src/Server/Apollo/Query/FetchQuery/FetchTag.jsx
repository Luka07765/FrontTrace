import { useQuery, useMutation } from '@apollo/client';
import {
  GET_TAGS,
  GET_TAG_BY_ID,
  CREATE_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  ASSIGN_TAG_TO_FILE,
  REMOVE_TAG_FROM_FILE,GET_FILES_BY_TAG,
} from '../Queries/TagQueries';

// Fetch all tags
export const useFetchTags = () => {
  const { data, loading, error, refetch } = useQuery(GET_TAGS);

  const tags = data?.getTags ?? []; // matches backend schema

  return { tags, loading, error, refetch };
};


// Fetch a single tag by ID
export const useFetchTagById = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_TAG_BY_ID, {
    variables: { id },
  });

  return { tag: data?.getTagById, loading, error, refetch };
};

export const useFetchFilesByTag = (tagId) => {
  const { data, loading, error, refetch } = useQuery(GET_FILES_BY_TAG, {
    variables: { tagId },
    skip: !tagId,
  });

  const files = data?.getFilesByTag ?? [];

  return { files, loading, error, refetch };
};
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
