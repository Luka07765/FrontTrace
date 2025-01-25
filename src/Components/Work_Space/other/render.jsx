import { useFileListLogic } from '@/Server/Apollo/Logic/Notes/QueryWorkTable';
import { useFileStore } from '@/Zustand/File_Store';
import { useRef, useEffect, useCallback } from 'react';
import { renderDeltas } from '@/Utils/Render';
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
  const editorRef = useRef(null);
  const saveTimeout = useRef(null);

  const handleDebouncedChange = useCallback(
    (e, setter, immediate = false) => {
      setter(e.target.innerText);

      // Clear the existing timeout
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
    },
    [snapshot, handleSubmitUpdate, handleUpdateFile]
  );

  const renderDeltas = (deltasArray) => {
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

  useEffect(() => {
    let parsed = [];
    console.log('Luka je car');

    if (editFileContent.trim() !== '') {
      try {
        parsed = JSON.parse(editFileContent);
        if (!Array.isArray(parsed)) {
          parsed = [];
        }
      } catch {
        parsed = [{ insert: editFileContent.trim() }];
      }
    }

    renderDeltas(parsed);
  }, [editFileId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        {editFileId && (
          <>
            <input
              className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-transparent"
              type="text"
              placeholder="File Title"
              value={editFileName}
              onChange={(e) => handleDebouncedChange(e, setEditFileName, true)} // Immediate save snapshot + update
            />
            <div
              ref={editorRef}
              contentEditable
              style={{
                border: '1px solid #ccc',
                minHeight: '200px',
                padding: '10px',
                marginBottom: '10px',
              }}
              onInput={(e) => handleDebouncedChange(e, setEditFileContent)}
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
          </>
        )}
      </div>
    </div>
  );
}
