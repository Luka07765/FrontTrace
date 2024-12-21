import React, { useState, useEffect } from 'react';
import './text.css';

const initialDocument = [
  { Insert: 'Hello', Attributes: null },
  { Insert: ' World', Attributes: { bold: true, italic: true } },
  { Insert: '!', Attributes: { underline: true, color: 'red' } },
];

function App() {
  const [document, setDocument] = useState(initialDocument);

  const applyDelta = (start, end, newAttributes) => {
    const newDocument = [];
    let currentIndex = 0;

    for (let i = 0; i < document.length; i++) {
      const part = document[i];
      const partLength = part.Insert.length;

      if (currentIndex + partLength > start && currentIndex < end) {
        const newParts = [];

        if (currentIndex < start) {
          newParts.push({
            Insert: part.Insert.slice(0, start - currentIndex),
            Attributes: part.Attributes,
          });
        }

        newParts.push({
          Insert: part.Insert.slice(
            Math.max(0, start - currentIndex),
            Math.min(partLength, end - currentIndex)
          ),
          Attributes: { ...part.Attributes, ...newAttributes },
        });

        if (currentIndex + partLength > end) {
          newParts.push({
            Insert: part.Insert.slice(end - currentIndex),
            Attributes: part.Attributes,
          });
        }

        newDocument.push(...newParts);
      } else {
        newDocument.push(part);
      }

      currentIndex += partLength;
    }

    setDocument(newDocument);
  };
  useEffect(() => {
    console.log('Document updated:', document);
  }, [document]); // This runs every time `document` changes

  const handleApplyStyle = (style) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      const startOffset = range.startOffset;
      const endOffset = range.endOffset;

      // Find the start and end indices based on the document
      let startIndex = 0;
      let endIndex = 0;
      let currentIndex = 0;

      for (let i = 0; i < document.length; i++) {
        const part = document[i];

        if (startContainer.textContent === part.Insert) {
          startIndex = currentIndex + startOffset;
        }

        if (endContainer.textContent === part.Insert) {
          endIndex = currentIndex + endOffset;
          break;
        }

        currentIndex += part.Insert.length;
      }

      // Apply the selected style to the selected range
      applyDelta(startIndex, endIndex, style);
      console.log({ start: startIndex, end: endIndex, style });
    }
  };
  console.log(initialDocument);

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={() => handleApplyStyle({ bold: true })}>Bold</button>
        <button onClick={() => handleApplyStyle({ italic: true })}>
          Italic
        </button>
        <button onClick={() => handleApplyStyle({ underline: true })}>
          Underline
        </button>
        <button onClick={() => handleApplyStyle({ color: 'blue' })}>
          Blue
        </button>
        <button onClick={() => handleApplyStyle({ color: 'green' })}>
          Green
        </button>
      </div>
      <div className="editor" contentEditable suppressContentEditableWarning>
        {document.map((part, index) => (
          <span
            key={index}
            className={Object.keys(part.Attributes || {})
              .filter((key) => part.Attributes[key] && key !== 'color')
              .join(' ')}
            style={{ color: part.Attributes?.color }}
          >
            {part.Insert}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
