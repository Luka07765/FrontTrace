import React, { useState } from 'react';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  const data = [
    {
      id: 1,
      name: 'Folder A',
      type: 'folder',
      children: [
        { id: 2, name: 'Iron Man', type: 'file' },
        { id: 3, name: 'Captain America', type: 'file' },
        {
          id: 4,
          name: 'Subfolder A1',
          type: 'folder',
          children: [
            { id: 5, name: 'Thor', type: 'file' },
            { id: 6, name: 'Black Widow', type: 'file' },
          ],
        },
      ],
    },
    {
      id: 7,
      name: 'Folder B',
      type: 'folder',
      children: [
        { id: 8, name: 'Hulk', type: 'file' },
        { id: 9, name: 'Hawkeye', type: 'file' },
      ],
    },
  ];

  const filterData = (items, query) => {
    return items
      .map((item) => {
        if (item.type === 'file' && item.name.toLowerCase().includes(query)) {
          return item;
        }

        if (item.type === 'folder') {
          const filteredChildren = filterData(item.children || [], query);
          if (
            filteredChildren.length > 0 ||
            item.name.toLowerCase().includes(query)
          ) {
            return { ...item, children: filteredChildren };
          }
        }

        return null;
      })
      .filter(Boolean);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = filterData(data, searchTerm);

  const renderTree = (items) => {
    return (
      <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
        {items.map((item) => (
          <li key={item.id}>
            <span
              style={{ fontWeight: item.type === 'folder' ? 'bold' : 'normal' }}
            >
              {item.name}
            </span>
            {item.children &&
              item.children.length > 0 &&
              renderTree(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Filterable Nested Files</h2>
      <input
        type="text"
        placeholder="Search files and folders..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      />
      {renderTree(filteredData)}
    </div>
  );
}
