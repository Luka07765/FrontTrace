import React, { useState } from 'react';

const SelectableNestedList = () => {
  const [nestedData, setNestedData] = useState([
    {
      id: 1,
      name: 'Parent 1',
      children: [
        { id: 2, name: 'Child 1.1' },
        {
          id: 3,
          name: 'Child 1.2',
          children: [
            { id: 4, name: 'Child 1.2.1' },
            { id: 5, name: 'Child 1.2.2' },
          ],
        },
      ],
    },
    {
      id: 6,
      name: 'Parent 2',
      children: [{ id: 7, name: 'Child 2.1' }],
    },
  ]);

  const [expandedItems, setExpandedItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      id: Date.now(), // Unique ID based on timestamp
      name: newItemName,
      children: [],
    };

    if (selectedItem) {
      const addNestedItem = (items) => {
        return items.map((item) => {
          if (item.id === selectedItem.id) {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            };
          }
          return {
            ...item,
            children: item.children ? addNestedItem(item.children) : [],
          };
        });
      };

      setNestedData((prevData) => addNestedItem(prevData));
    } else {
      setNestedData((prevData) => [...prevData, newItem]);
    }

    setNewItemName(''); // Clear input field
  };

  const renderNestedList = (items) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <div>
              <span
                style={{
                  cursor: 'pointer',
                  fontWeight: selectedItem?.id === item.id ? 'bold' : 'normal',
                }}
                onClick={() => handleSelect(item)}
              >
                {item.name}
              </span>
              {item.children && (
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => toggleExpand(item.id)}
                >
                  {expandedItems[item.id] ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
            {item.children &&
              expandedItems[item.id] &&
              renderNestedList(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h3>Nested List</h3>
      {renderNestedList(nestedData)}

      {selectedItem && (
        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
          Selected Item: {selectedItem.name}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="New Item Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button onClick={handleAddItem} style={{ marginLeft: '10px' }}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export default SelectableNestedList;
