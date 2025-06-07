// useSearchFolders.js
export const useSearchFolders = (nestedFolders, query) => {
  const findMatchingItems = (items, query, breadcrumb = '') => {
    if (!items || !Array.isArray(items)) return [];

    let matches = [];

    items.forEach((item) => {
      if (!item) return;

      const currentBreadcrumb = breadcrumb
        ? `${breadcrumb} / ${item.title || 'Untitled'}`
        : item.title || 'Untitled';

      // Match folder
      if (item.title?.toLowerCase().includes(query)) {
        matches.push({
          ...item,
          type: 'folder',
          breadcrumb: currentBreadcrumb,
        });
      }

      // Match files
      if (Array.isArray(item.files)) {
        item.files.forEach((file) => {
          if (file.name?.toLowerCase().includes(query)) {
            matches.push({
              ...file,
              type: 'file',
              breadcrumb: `${currentBreadcrumb} / ${file.name}`,
            });
          }
        });
      }

      // Search in children
      if (Array.isArray(item.children)) {
        matches = matches.concat(
          findMatchingItems(item.children, query, currentBreadcrumb)
        );
      }
    });

    return matches;
  };

  return query ? findMatchingItems(nestedFolders || [], query) : [];
};
