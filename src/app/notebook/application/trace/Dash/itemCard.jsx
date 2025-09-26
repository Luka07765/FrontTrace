'use client';
import { useItemStore } from '../Test/itemStore';


export default function ItemCard({ item }) {

  const updateItem = useItemStore(state => state.updateItem);

  if (!item) return null;

  return (
    <div className="border p-2 mb-2 rounded bg-white w-64">
       <h3 className="font-bold text-black">{item.title}</h3>

  
    </div>
  );
}
