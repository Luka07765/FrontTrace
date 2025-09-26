// stores/itemStore.js
import { create } from 'zustand';

export const useItemStore = create((set) => ({
  items: {
    '1': { id: '1', title: 'First Item', content: 'This is the first item content.' },
    '2': { id: '2', title: 'Second Item', content: 'This is the second item content.' },
    '3': { id: '3', title: 'Third Item', content: 'This is the third item content.' },
  },
  updateItem: (id, data) =>
    set(state => ({
      items: { ...state.items, [id]: { ...state.items[id], ...data } }
    })),
}));
