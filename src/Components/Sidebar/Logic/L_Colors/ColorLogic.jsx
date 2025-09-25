// hooks/useFolderColors.js
import { useFileListLogic } from '@/Server/GraphQl/Operations/Logic/File_Logic';

export function useFolderColors(folder) {
  const { files = [] } = useFileListLogic();

  const getAllDescendantIds = (f) => {
    let ids = [f.id];
    if (f.children) {
      f.children.forEach(child => {
        ids = ids.concat(getAllDescendantIds(child));
      });
    }
    return ids;
  };

  const allFolderIds = getAllDescendantIds(folder);

  const filesInTree = files.filter(file =>
    allFolderIds.includes(file.folderId)
  );

  const redCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'red').length;
  const yellowCount = filesInTree.filter(f => f.colors?.toLowerCase() === 'yellow').length;

  return { redCount, yellowCount };
}
