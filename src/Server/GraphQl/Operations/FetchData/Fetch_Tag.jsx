import { useQuery, useMutation } from '@apollo/client';

import {

  GET_TAGS,
  GET_TAG_BY_ID,
  GET_FILES_BY_TAG
} from '../../Query/Queries/Tag';


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