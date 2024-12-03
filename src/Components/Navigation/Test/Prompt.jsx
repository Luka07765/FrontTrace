export const FolderModal = ({
  isVisible,
  title,
  folderName,
  setFolderName,

  onSubmit,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-700 p-6 rounded">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <input
          type="text"
          placeholder="Folder Title"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full px-2 py-1 mb-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
        />

        <div className="flex space-x-2">
          <button
            onClick={onSubmit}
            className="w-full px-2 py-1 bg-green-500 rounded hover:bg-green-600 focus:outline-none"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="w-full px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
