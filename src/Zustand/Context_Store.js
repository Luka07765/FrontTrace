import { create } from 'zustand';

export const ContextClick = create((set) => ({
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  contextMenuTarget: { type: null}, // type can be 'folder' | 'file' | 'empty' | null
  setContextMenuTarget: (target) => set({ contextMenuTarget: target }),

  iconSelected: null,
  setIconSelected: (icon) => set({ iconSelected: icon }),
    resetIconSelected: () => set({ iconSelected: null }),
  
}));
