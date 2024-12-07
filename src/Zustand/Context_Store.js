import { create } from 'zustand';

export const Click = create((set) => ({
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),
}));
