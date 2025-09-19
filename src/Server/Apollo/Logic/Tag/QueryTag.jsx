import {
  useFetchTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  useAssignTagToFile,
  useRemoveTagFromFile,
} from '@/Server/Apollo/Query/FetchQuery/FetchTag';
import {
  GET_TAGS,
} from '@/Server/Apollo/Query/Queries/TagQueries';

export function useTagLogic() {
  const { tags, loading, error, refetch } = useFetchTags();
  const [createTag] = useCreateTag();
  const [updateTag] = useUpdateTag();
  const [deleteTag] = useDeleteTag();
  const [assignTagToFile] = useAssignTagToFile();
  const [removeTagFromFile] = useRemoveTagFromFile();

  // Create Tag
  const handleCreateTag = async (tagData) => {
    const { title, color, iconId } = tagData;
    if (!title) {
      alert('Tag title is required.');
      return;
    }

    try {
      await createTag({
        variables: {
          input: { title, color, iconId },
        },
        update: (cache, { data: { createTag } }) => {
          const existingData = cache.readQuery({ query: GET_TAGS });
          if (existingData?.getAllTags) {
            cache.writeQuery({
              query: GET_TAGS,
              data: {
                getAllTags: [
                  ...existingData.getAllTags,
                  { ...createTag, __typename: 'Tag' },
                ],
              },
            });
          }
        },
      });
    } catch (err) {
      console.error('Error creating tag:', err);
      alert('Failed to create tag. Please try again.');
    }
  };

  // Update Tag
  const handleUpdateTag = async (tagData) => {
    const { id, title, color, iconId } = tagData;
    if (!id) {
      alert('Tag ID is required.');
      return;
    }

    const input = {};
    if (title !== undefined) input.title = title;
    if (color !== undefined) input.color = color;
    if (iconId !== undefined) input.iconId = iconId;

    try {
      await updateTag({
        variables: { id: id.toString(), input },
        update: (cache, { data: { updateTag } }) => {
          const existingData = cache.readQuery({ query: GET_TAGS });
          if (existingData?.getAllTags) {
            cache.writeQuery({
              query: GET_TAGS,
              data: {
                getAllTags: existingData.getAllTags.map((tag) =>
                  tag.id === id
                    ? { ...updateTag, __typename: 'Tag' }
                    : tag
                ),
              },
            });
          }
        },
      });
    } catch (err) {
      console.error('Error updating tag:', err);
      alert('Failed to update tag. Please try again.');
    }
  };

  // Delete Tag
  const handleDeleteTag = async (id) => {
    try {
      await deleteTag({
        variables: { id: id.toString() },
        update: (cache) => {
          const existingData = cache.readQuery({ query: GET_TAGS });
          if (existingData?.getAllTags) {
            cache.writeQuery({
              query: GET_TAGS,
              data: {
                getAllTags: existingData.getAllTags.filter((tag) => tag.id !== id),
              },
            });
          }
        },
      });
    } catch (err) {
      console.error('Error deleting tag:', err);
      alert('Failed to delete tag. Please try again.');
    }
  };

  // Assign tag to file
  const handleAssignTagToFile = async (fileId, tagId) => {
    try {
      await assignTagToFile({ variables: { fileId, tagId } });
    } catch (err) {
      console.error('Error assigning tag to file:', err);
      alert('Failed to assign tag. Please try again.');
    }
  };

  // Remove tag from file
  const handleRemoveTagFromFile = async (fileId, tagId) => {
    try {
      await removeTagFromFile({ variables: { fileId, tagId } });
    } catch (err) {
      console.error('Error removing tag from file:', err);
      alert('Failed to remove tag. Please try again.');
    }
  };

  return {
    tags,
    loading,
    error,
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleAssignTagToFile,
    handleRemoveTagFromFile,
    refetch,
  };
}
