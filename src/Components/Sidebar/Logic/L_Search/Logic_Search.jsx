export function findMatchingItems(items, query, breadcrumb = '') {
  if (!items || !Array.isArray(items)) return [];

  const matches = [];
  const normalizedQuery = query.toLowerCase();

  items.forEach((item) => {
    if (!item) return;

    const currentBreadcrumb = breadcrumb
      ? `${breadcrumb} / ${item.title || 'Untitled'}`
      : item.title || 'Untitled';


    if (item.title && item.title.toLowerCase().includes(normalizedQuery)) {
      matches.push({
        ...item,
        breadcrumb: currentBreadcrumb,
        type: 'folder',
      });
    }


    if (Array.isArray(item.files)) {
      item.files.forEach((file) => {
        if (file.title && file.title.toLowerCase().includes(normalizedQuery)) {
          matches.push({
            ...file,
            breadcrumb: `${currentBreadcrumb} / ${file.title}`,
            type: 'file',
          });
        }
      });
    }

    // Recurse children
    if (Array.isArray(item.children) && item.children.length > 0) {
      matches.push(
        ...findMatchingItems(item.children, normalizedQuery, currentBreadcrumb)
      );
    }
  });

  return matches;
}
