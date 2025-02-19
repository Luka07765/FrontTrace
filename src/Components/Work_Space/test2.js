import React, { useRef, useEffect, useState } from 'react';

const Toolbar = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(''); // Store content when needed

  useEffect(() => {
    console.log('Editor Mounted:', editorRef.current);
  }, []);

  const addIcon = (icon) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const iconNode = document.createTextNode(icon);
      range.insertNode(iconNode);
    }
  };

  const applyStyle = (tag, style) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const element = document.createElement(tag);

      if (style) {
        Object.assign(element.style, style);
      }

      element.appendChild(selectedText);
      range.insertNode(element);
    }
  };

  // Debounced content update
  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML); // Sync only when needed
    }
  };

  return (
    <div>
      <div className="toolbar bg-white">
        <button onClick={() => addIcon('😄')}>IKONA</button>
        <button onClick={() => applyStyle('b')} title="Bold">
          <b>B</b>
        </button>
        <button onClick={() => applyStyle('i')} title="Italic">
          <i>I</i>
        </button>
        <button onClick={() => applyStyle('u')} title="Underline">
          <u>U</u>
        </button>
        <button onClick={() => applyStyle('span', { fontWeight: '900' })}>
          <strong>Bold (900 weight)</strong>
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="editor bg-white"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onInput={handleContentChange} // Sync only when text is edited
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          marginTop: '10px',
        }}
      >
        <p>Rondom Text</p>
      </div>

      {/* Debugging: Show Synced Content */}
      <div className="preview mt-4 p-2 border">
        <strong>Synced Content:</strong>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default Toolbar;
