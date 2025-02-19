import React, { useRef, useEffect } from 'react';

const Toolbar = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    console.log(editorRef.current); // Logs the current value of editorRef
  }, [editorRef]);
  const addIcon = (icon) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const iconNode = document.createTextNode(icon); // Create a text node for the icon
      range.insertNode(iconNode); // Insert the icon at the caret position
    }
  };

  const applyStyle = (tag, style) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents(); // Extract the selected text
      const element = document.createElement(tag); // Create an element with the given tag

      if (style) {
        Object.assign(element.style, style); // Apply inline styles if provided
      }

      element.appendChild(selectedText); // Add the selected text to the new element
      range.insertNode(element); // Insert the new element back into the editor
    }
  };

  // Predefined style object
  const stil = {
    fontWeight: '900',
  };
  const size = {
    fontSize: '50px',
  };
  const color = {
    backgroundColor: 'blue',
  };
  const TextColor = {
    color: 'red',
  };

  const Left = {
    textAlign: 'left',
  };
  const Right = {
    textAlign: 'right',
  };
  const Center = {
    textAlign: 'center',
  };

  return (
    <div>
      {/* Toolbar Buttons */}
      <div className="toolbar bg-white">
        <button onClick={() => addIcon('😄')}>IKONA</button>
        <button onClick={() => applyStyle('b')} title="Bold (original)">
          <b>B</b>
        </button>
        <button onClick={() => applyStyle('i')} title="Italic">
          <i>I</i>
        </button>
        <button onClick={() => applyStyle('u')} title="Underline">
          <u>U</u>
        </button>
        <button onClick={() => applyStyle('strike')} title="Strikethrough">
          S
        </button>
        <button onClick={() => applyStyle('strong')} title="Bold (strong)">
          <strong>Strong</strong>
        </button>
        <button
          onClick={() => applyStyle('span', stil)}
          title="Bold (with style)"
        >
          <strong>900 weight</strong>
        </button>
        <button onClick={() => applyStyle('span', size)} title="Underline">
          <u>H1</u>
        </button>
        <button onClick={() => applyStyle('span', color)} title="Underline">
          <u>Blue</u>
        </button>
        <button onClick={() => applyStyle('span', TextColor)} title="Underline">
          <u>TextColor</u>
        </button>
        <button onClick={() => applyStyle('div', Left)} title="Underline">
          <u>Left</u>
        </button>
        <button onClick={() => applyStyle('div', Center)} title="Underline">
          <u>Centar</u>
        </button>
        <button onClick={() => applyStyle('div', Right)} title="Underline">
          <u>Right</u>
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="editor bg-white"
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          marginTop: '10px',
        }}
      >
        <p>Rondom Text</p>
      </div>
    </div>
  );
};

export default Toolbar;
