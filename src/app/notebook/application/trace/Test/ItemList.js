'use client';
import { useItemStore } from './itemStore';
import { useMemo } from 'react';

export default function ItemList({ render }) {
  const items = useItemStore(state => state.items);
  return (
    <>
      {Object.values(items).map(item => render(item))}
    </>
  );
}

