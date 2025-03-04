export default function UndoRedoButtons({ undo, redo }) {
  return (
    <div className="flex space-x-2 bg-white">
      <button onClick={undo} className="px-4 py-2 border rounded">
        Undo
      </button>
      <button onClick={redo} className="px-4 py-2 border rounded">
        Redo
      </button>
    </div>
  );
}
