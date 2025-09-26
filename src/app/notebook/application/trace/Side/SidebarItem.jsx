'use client';
import { useItemStore } from '../itemStore';

export default function SidebarItem({ item }) {

  return (
    <div className="border p-1 mb-1 bg-gray-100 w-40">
      <strong>{item.title}</strong>
      <strong>{item.content}</strong>
    </div>
  );
}
