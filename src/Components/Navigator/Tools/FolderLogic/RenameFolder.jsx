import { Click } from '@/Zustand/Click_Store';
import { useFolderListLogic } from '@/Server/Apollo/Logic/SideBar/QuerySideBar';
import { useFileStore } from '@/Zustand/File_Store';
export const RenameFolder = ({ folder }) => {
  const { setEditingFolderId, folderName, setFolderName } = Click();
  const { handleUpdateFolder } = useFolderListLogic();

  const handleRename = (folderId) => {
    if (folderName.trim() !== '') {
      handleUpdateFolder({ id: folderId, title: folderName.trim() });
    }

    setEditingFolderId(null);
  };
  return (
    <div>
      <input
        className="bg-gray-800 text-white border-b-2 border-gray-900 h-7 focus:outline-none"
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onBlur={() => handleRename(folder.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleRename(folder.id);
          } else if (e.key === 'Escape') {
            setEditingFolderId(null);
            setFolderName('');
          }
        }}
        autoFocus
      />
    </div>
  );
};

export default RenameFolder;
