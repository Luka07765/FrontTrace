import React, { useRef } from 'react';

const Toolbar = () => {
  const editorRef = useRef(null);

  const addIcon = (icon) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const iconNode = document.createTextNode(icon);
      range.insertNode(iconNode);
    }
  };

  const addLine = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Create the line element (hr)
      const lineNode = document.createElement('hr');
      lineNode.style.borderTop = '1px dotted #888';
      lineNode.style.width = '80%';
      lineNode.style.margin = '20px auto';
      lineNode.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.8)';

      // Insert the line node at the current caret position
      range.insertNode(lineNode);

      // Move the caret after the inserted node (optional, but user-friendly)
      range.setStartAfter(lineNode);
      range.setEndAfter(lineNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div>
      {/* Toolbar Buttons */}
      <div className="toolbar">
        <button onClick={() => addIcon('😄')}>IKONA</button>
        <button onClick={addLine}>Add Line</button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="editor"
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          marginTop: '10px',
        }}
      >
        <p>Type something here...</p>
      </div>
    </div>
  );
};

export default Toolbar;
