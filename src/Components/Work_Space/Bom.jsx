import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useState, useEffect } from 'react';

export default function FileList() {
  const { handleUpdateFile } = useFileListLogic();
  const {
    editFileId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
    handleSubmitUpdate,
    snapshot,
    undo,
    redo,
  } = useFileStore();

  const saveTimeout = useRef(null);
  const editorRef = useRef(null);
  const [deltas, setDeltas] = useState([]);

  useEffect(() => {
    // Parse the stored content into deltas
    let parsed = [];
    if (editFileContent && editFileContent.trim() !== '') {
      try {
        parsed = JSON.parse(editFileContent);
        if (!Array.isArray(parsed)) {
          parsed = [];
        }
      } catch {
        // If invalid JSON, convert it into a simple delta array
        parsed = [{ insert: editFileContent.trim() }];
      }
    }
    setDeltas(parsed);
    renderDeltas(parsed);
  }, [editFileContent]);

  const renderDeltas = (deltasArray) => {
    // Convert deltas into styled HTML for display
    const html = deltasArray
      .map((delta) => {
        const styles = delta.attributes
          ? Object.entries(delta.attributes)
              .map(([attrKey, attrValue]) => {
                switch (attrKey) {
                  case 'bold':
                    return attrValue ? 'font-weight: bold;' : '';
                  case 'color':
                    return `color: ${attrValue};`;
                  case 'fontSize':
                    return `font-size: ${attrValue};`;
                  default:
                    return '';
                }
              })
              .join(' ')
          : '';

        return `<span style="${styles}">${delta.insert}</span>`;
      })
      .join('');

    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  };

  const applyStyle = (newAttributes) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    // Remove selected text and insert styled span for display
    range.deleteContents();
    const span = document.createElement('span');

    // Apply inline CSS based on attributes
    Object.keys(newAttributes).forEach((attrKey) => {
      switch (attrKey) {
        case 'bold':
          if (newAttributes[attrKey]) span.style.fontWeight = 'bold';
          break;
        case 'color':
          span.style.color = newAttributes[attrKey];
          break;
        case 'fontSize':
          span.style.fontSize = newAttributes[attrKey];
          break;
        default:
          break;
      }
    });

    span.textContent = selectedText;
    range.insertNode(span);

    // Append a new delta for the styled text
    const updatedDeltas = [
      ...deltas,
      { Insert: selectedText, Attributes: newAttributes },
    ];
    setDeltas(updatedDeltas);

    // Update the store with the JSON string of these deltas
    setEditFileContent(JSON.stringify(updatedDeltas));
  };

  const handleDebouncedChange = (e, setter, immediate = false) => {
    setter(e.target.value);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(
      () => {
        snapshot();
        handleSubmitUpdate(handleUpdateFile);
      },
      immediate ? 0 : 2000
    );
  };

  const handleManualSave = () => {
    // On manual save, just snapshot and submit update
    snapshot();
    handleSubmitUpdate(handleUpdateFile);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        {editFileId && (
          <>
            {/* Title Input */}
            <input
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
              type="text"
              placeholder="File Title"
              value={editFileName}
              onChange={(e) => handleDebouncedChange(e, setEditFileName, true)}
            />

            {/* Toolbar */}
            <div style={{ marginBottom: '10px' }}>
              <button onClick={() => applyStyle({ bold: true })}>Bold</button>
              <button onClick={() => applyStyle({ color: '#FF0000' })}>
                Red
              </button>
              <button onClick={() => applyStyle({ fontSize: '20px' })}>
                Large Font
              </button>
            </div>

            {/* ContentEditable Editor */}
            <div
              ref={editorRef}
              contentEditable
              style={{
                border: '1px solid #ccc',
                minHeight: '200px',
                padding: '10px',
                marginBottom: '10px',
              }}
              onInput={() => {
                // If user types directly without selection:
                // You could implement logic here to merge typed text into deltas.
                // For simplicity, any newly typed text remains unstyled until selected and styled.
              }}
            ></div>

            {/* Undo/Redo Buttons */}
            <div className="flex space-x-2">
              <button onClick={undo} className="px-4 py-2 border rounded">
                Undo
              </button>
              <button onClick={redo} className="px-4 py-2 border rounded">
                Redo
              </button>
            </div>

            {/* Manual Save Button */}
            <div>
              <button
                onClick={handleManualSave}
                className="px-4 py-2 border rounded"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
