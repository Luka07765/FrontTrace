

export function findMatchingItems(items, query, breadcrumb = '') {
  if (!items || !Array.isArray(items)) return [];

  let matches = [];

  items.forEach((item) => {
    if (!item) return;

    const currentBreadcrumb = breadcrumb
      ? `${breadcrumb} / ${item.title || 'Untitled'}`
      : item.title || 'Untitled';

   
    if (item.title && item.title.toLowerCase().includes(query)) {
      matches.push({
        ...item,
        breadcrumb: currentBreadcrumb,
        type: 'folder',
      });
    }


    if (item.files && Array.isArray(item.files)) {
      item.files.forEach((file) => {
        if (file.title && file.title.toLowerCase().includes(query)) {
          matches.push({
            ...file,
            breadcrumb: `${currentBreadcrumb} / ${file.title}`,
            type: 'file',
          });
        }
      });
    }

    
    if (item.children && item.children.length > 0) {
      matches = matches.concat(
        findMatchingItems(item.children, query, currentBreadcrumb)
      );
    }
  });

  return matches;
}
