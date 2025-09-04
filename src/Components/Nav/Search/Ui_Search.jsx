export default function SearchResults({ 
  searchTerm, 
  matchingItems, 
  setSelectedFolderId 
}) {
  if (!searchTerm) return null; 

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Search Results</h3>

      {matchingItems.length > 0 ? (
        <ul>
          {matchingItems.map((item) => (
            <li
              key={item.id}
              className="mb-2 p-2 hover:bg-neutral-700/40 rounded cursor-pointer"
              onClick={() => {
                if (item.type === "folder") {
                  setSelectedFolderId(item.id);
                } else {
                  console.log("Selected file:", item.id); // you can later replace this
                }
              }}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {item.type === "folder" ? "📁" : "📄"}
                </span>
                <span className="text-sm">{item.breadcrumb}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}
