// IconPickerStore.js
import { create } from "zustand";

export const useIconPickerStore = create((set) => ({
  open: false,
  file: null,
  setOpen: (open, file = null) => set({ open, file }),
}));
