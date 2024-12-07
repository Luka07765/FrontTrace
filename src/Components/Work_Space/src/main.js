import React, { useRef } from 'react';

const Toolbar = () => {
  const editorRef = useRef(null);

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
  const Game = {
    button: {
      background: '#6f2ed8',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'background 0.3s, transform 0.2s',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
    buttonHover: {
      background: '#fe5f55',
      transform: 'translateY(-3px)',
    },
    buttonBefore: {
      content: "''",
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '300%',
      height: '300%',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%) scale(0)',
      transition: 'transform 0.5s ease',
      zIndex: 0,
    },
    editor: {
      width: '70vw',
      minHeight: '200px',
      padding: '20px',
      border: '2px solid #6f2ed8',
      borderRadius: '8px',
      background: 'green',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      overflow: 'auto',
      transition: 'background 0.3s',
    },
    editorHover: {
      background: 'rgba(0, 0, 0, 0.9)',
    },
    neonText: {
      fontSize: '3rem',
      textTransform: 'uppercase',
      color: '#e6f14a',
      textShadow: '0 0 5px #e6f14a, 0 0 10px #bf4080, 0 0 15px #fe5f55',
    },
  };

  return (
    <div>
      {/* Toolbar Buttons */}
      <div className="toolbar">
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
        <button
          onClick={() => applyStyle('span', Game.neonText)}
          title="Neon Text"
        >
          <u>Neon</u>
        </button>

        <button
          onClick={() => applyStyle('span', Game.button)}
          title="Styled Button"
        >
          <u>Styled Button</u>
        </button>

        <button
          onClick={() => applyStyle('span', Game.editor)}
          title="Styled Editor"
        >
          <u>Editor Style</u>
        </button>
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
        <p>Bold - Done</p>
        <p>Icons - Done Advances checkBox</p>
        <p>Highlight - Done</p>
        <p>TextSize - Done</p>
        <p>TextColor - Done</p>
        <p>TextStyles - Done</p>
        <p>TextShape with modern look</p>
        <p>FORMATING DONE </p>

        <p>Numbers ADVANCED OneNote</p>
        <p>Nested Text ADVANCED </p>
      </div>
    </div>
  );
};

export default Toolbar;
