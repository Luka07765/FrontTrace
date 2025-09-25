import { useQuery, useMutation } from '@apollo/client';

import {
  GET_TAGS,
  GET_TAG_Files,
} from '../../Query/Queries/Tag';


export const useFetchTags = () => {
  const { data, loading, error, refetch } = useQuery(GET_TAGS);

  const tags = data?.getTags ?? []; // matches backend schema

  return { tags, loading, error, refetch };
};


// Fetch a single tag by ID
export const useFetchTagFiles = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_TAG_Files, {
    variables: { id },
  });

  return { tag: data?.getTagById, loading, error, refetch };
};

