"use client"
import React, { useState, useRef } from "react";

const initialItems = ["Item 1", "Item 2", "Item 3", "Item 4"];

export default function DraggableList() {
  const [items, setItems] = useState(initialItems);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const updatedItems = [...items];
    const dragged = updatedItems[dragItem.current];
    updatedItems.splice(dragItem.current, 1);
    updatedItems.splice(dragOverItem.current, 0, dragged);
    setItems(updatedItems);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item, index) => (
        <li
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          style={{
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            cursor: "grab",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
