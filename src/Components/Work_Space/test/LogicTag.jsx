import { useFetchTags, useCreateTag } from '@/Server/Apollo/Query/FetchQuery/FetchTag';

export function useTagLogic() {
  const { tags, loading, error, refetch } = useFetchTags();
  const [createTag] = useCreateTag();

  const handleCreateTag = async (tagData) => {
  const { title, color, iconId } = tagData;
  console.log('Creating tag with:', { title, color, iconId });

  if (!title || !color || !iconId) {
    alert('All fields are required: title, color, iconId');
    return;
  }

  try {
    const result = await createTag({
      variables: {
        input: {
          title,
          color,
          iconId: Number(iconId), // <-- force int
        },
      },
    });
    console.log('Mutation result:', result);
    await refetch();
  } catch (err) {
    console.error('Full Apollo error:', err);
    alert('Failed to create tag. Check console for details.');
  }
};

  return {
    tags,
    loading,
    error,
    handleCreateTag,
    refetch,
  };
}
