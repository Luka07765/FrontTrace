"use client";

import React from 'react'; // always import React in JSX files
import { useFetchTags } from '@/Server/Apollo/Query/FetchQuery/FetchTag'; 

const TagList = () => {
  const { tags, loading, error, refetch } = useFetchTags();

  if (loading) return <p>Loading tags...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Tags</h2>
      <button onClick={() => refetch()}>Refresh Tags</button>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <strong>{tag.title}</strong> - {tag.color} - Icon ID: {tag.iconId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagList;