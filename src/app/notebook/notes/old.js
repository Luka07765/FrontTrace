import React, { useState, useRef } from 'react';
import './App.css'; // Ensure App.css has the necessary styles

const ResizableSidebar = () => {
  const [sidebarWidth, setSidebarWidth] = useState(200); // Initial width for usability
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 100 && newWidth <= 800) {
        // Keep within bounds
        setSidebarWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="container">
      {/* Sidebar Section */}
      <div
        ref={sidebarRef}
        className={`sidebar ${isResizing ? 'resizing' : ''}`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="content">
          <h2>Sidebar Content</h2>
          <p>Some additional sidebar details here.</p>
        </div>
        <div className="resizer" onMouseDown={handleMouseDown} />
      </div>

      {/* Main Content Section */}
      <div
        className="main-content"
        style={{
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          transition: isResizing ? 'none' : 'left 0.3s ease',
        }}
      >
        <div className="main-content-wrapper">
          <h1>Main Content Area</h1>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default ResizableSidebar;
