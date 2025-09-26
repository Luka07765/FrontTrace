'use client';
import { useItemStore } from '../itemStore';


export default function ItemCard({ item }) {

  const updateItem = useItemStore(state => state.updateItem);

  if (!item) return null;

  return (
    <div className="border p-2 mb-2 rounded bg-white w-64">
       <h3 className="font-bold">{item.title}</h3>
      <p>{item.content}</p>
      <button
        className="mt-2 p-1 bg-blue-500 text-white rounded"
        onClick={() => updateItem(item.id, { title: item.title + ' ✅' })}
      >
        Update Title
      </button>
    </div>
  );
}
