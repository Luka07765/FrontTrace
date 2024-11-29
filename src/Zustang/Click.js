import create from 'zustand';

export const useContextMenuStore = create((set) => ({
  // Context menu visibility state
  contextMenuVisible: false,
  setContextMenuVisible: (isVisible) => set({ contextMenuVisible: isVisible }),

  // Context menu position state
  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  // Helper method to hide the context menu
  hideContextMenu: () => set({ contextMenuVisible: false }),
}));
