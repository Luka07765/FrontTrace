import { create } from 'zustand';

export const useFolderStore = create((set) => ({
  nullExpend: false,
  setNullExpend: (val) => set({ nullExpend: val }),
}));
