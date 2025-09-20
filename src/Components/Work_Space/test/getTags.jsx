import { useState } from 'react';
import { useTagLogic } from '@/Server/Apollo/Logic/Tag/QueryTag';

const TagManager = ({ fileId }) => {
  const {
    tags,
    loading,
    error,
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleAssignTagToFile,
    handleRemoveTagFromFile,
  } = useTagLogic();

  const [selectedTag, setSelectedTag] = useState(null);
  const [newTagTitle, setNewTagTitle] = useState('');

  if (loading) return <p>Loading tags...</p>;
  if (error) return <p>Error loading tags: {error.message}</p>;

  return (
    <div className="p-4 w-full max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tags</h2>

      {/* Create Tag */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="New tag title"
          value={newTagTitle}
          onChange={(e) => setNewTagTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            handleCreateTag({ title: newTagTitle });
            setNewTagTitle('');
          }}
        >
          Create
        </button>
      </div>

      {/* Tag List */}
      <ul className="space-y-2">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className="flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {tag.iconId && <img src={`/icons/${tag.iconId}.svg`} alt="" className="w-5 h-5" />}
              <span style={{ color: tag.color }}>{tag.title}</span>
            </div>

            <div className="flex gap-2">
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => setSelectedTag(tag)}
              >
                Edit
              </button>
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => handleDeleteTag(tag.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit / Assign Modal */}
      {selectedTag && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedTag(null)}
            >
              ✖
            </button>

            <h3 className="font-semibold mb-2">Edit Tag</h3>

            <input
              type="text"
              value={selectedTag.title}
              onChange={(e) =>
                setSelectedTag((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="color"
              value={selectedTag.color}
              onChange={(e) =>
                setSelectedTag((prev) => ({ ...prev, color: e.target.value }))
              }
              className="w-full mb-2 h-10 rounded"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  handleUpdateTag(selectedTag);
                  setSelectedTag(null);
                }}
              >
                Save
              </button>
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSelectedTag(null)}
              >
                Cancel
              </button>
            </div>

            {/* Assign / Remove from File */}
            {fileId && (
              <div className="mt-4">
                <button
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 w-full"
                  onClick={() => handleAssignTagToFile(fileId, selectedTag.id)}
                >
                  Assign to this file
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full mt-2"
                  onClick={() => handleRemoveTagFromFile(fileId, selectedTag.id)}
                >
                  Remove from this file
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
