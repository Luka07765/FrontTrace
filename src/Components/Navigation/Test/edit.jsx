import { Click } from '@/Zustang/ClickLogic';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
export const EditModal = () => {
  const {
    folderName,
    setFolderName,
    showEdit,
    resetModalState,

    submitEdit,
  } = Click();
  const { handleUpdateFolder } = useFolderListLogic();
  if (!showEdit) return null;

  const RenameFolder = () => submitEdit(handleUpdateFolder);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-700 p-6 rounded">
        <input
          type="text"
          placeholder="Edit Title"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full px-2 py-1 mb-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-400"
        />

        <div className="flex space-x-2">
          <button
            onClick={RenameFolder}
            className="w-full px-2 py-1 bg-green-500 rounded hover:bg-green-600 focus:outline-none"
          >
            Save
          </button>
          <button
            onClick={resetModalState}
            className="w-full px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};