import React, { useState } from 'react';

function NoteTakingApp() {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    const { key, target } = e;

    // Handle "Tab" key to insert a nested bullet point with indentation
    if (key === 'Tab') {
      e.preventDefault(); // Prevent default tab action (move focus)

      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Find the current line
      const lines = text.substring(0, start).split('\n');
      const lastLine = lines[lines.length - 1];
      const indentation = lastLine.match(/^\t*/)[0]; // Preserve current indentation

      // Insert a new nested bullet point with one more tab
      const newText =
        text.substring(0, start) +
        '\n' +
        indentation +
        '\t• ' +
        text.substring(end);
      setText(newText);

      // Move the cursor after the nested bullet point
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4; // Move cursor after the inserted bullet
      }, 0);
    }

    // Handle "Enter" key to auto-number new lines or continue nested bullets
    if (key === 'Enter') {
      e.preventDefault(); // Prevent default newline behavior

      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1];
      let newLineText = '';

      // Check if the last line is a bullet point (starts with bullet) or a numbered line
      const isBullet = lastLine.trim().startsWith('•');
      const isNested = lastLine.startsWith('\t'); // Check for any level of nesting

      if (isBullet) {
        // Continue with the same level of bullet nesting
        const indentation = lastLine.match(/^\t*/)[0];
        newLineText = `${indentation}• `;
      } else {
        // Handle numbered lists, increase number if not nested
        const nextNumber =
          lines.filter(
            (line) => !line.trim().startsWith('•') && !line.startsWith('\t')
          ).length + 1;
        newLineText = isNested ? '\t• ' : `${nextNumber}. `;
      }

      const newText = text + '\n' + newLineText;
      setText(newText);

      // Move the cursor to the end of the new line
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = newText.length;
      }, 0);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Press Tab for nesting with dots, Enter for new lines"
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
    </div>
  );
}

export default NoteTakingApp;
