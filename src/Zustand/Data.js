// Zustand/Data.js
import { create } from "zustand";
import { buildNestedStructure } from "@/Utils/Data_Structure/Structure";

export const useData = create((set, get) => ({
  dataFolders: [],
  dataFiles: [],
  nestedFolders: [],

  // --- Bulk setters that auto-update nestedFolders ---
  setDataFolders: (newFolders) => {
    const files = get().dataFiles;
    set({
      dataFolders: newFolders,
      nestedFolders: buildNestedStructure(newFolders, files),
    });
  },
  setDataFiles: (newFiles) => {
    const folders = get().dataFolders;
    set({
      dataFiles: newFiles,
      nestedFolders: buildNestedStructure(folders, newFiles),
    });
  },

  // --- Folder actions ---
  addFolder: (folder) => {
    const newFolders = [...get().dataFolders, folder];
    set({
      dataFolders: newFolders,
      nestedFolders: buildNestedStructure(newFolders, get().dataFiles),
    });
  },
  updateFolder: (id, updatedData) => {
    const newFolders = get().dataFolders.map(f =>
      f.id === id ? { ...f, ...updatedData } : f
    );
    set({
      dataFolders: newFolders,
      nestedFolders: buildNestedStructure(newFolders, get().dataFiles),
    });
  },
  deleteFolder: (id) => {
    const newFolders = get().dataFolders.filter(f => f.id !== id);
    set({
      dataFolders: newFolders,
      nestedFolders: buildNestedStructure(newFolders, get().dataFiles),
    });
  },

  // --- File actions ---
  addFile: (file) => {
    const newFiles = [...get().dataFiles, file];
    set({
      dataFiles: newFiles,
      nestedFolders: buildNestedStructure(get().dataFolders, newFiles),
    });
  },
  updateFile: (id, updatedData) => {
    const newFiles = get().dataFiles.map(f =>
      f.id === id ? { ...f, ...updatedData } : f
    );
    set({
      dataFiles: newFiles,
      nestedFolders: buildNestedStructure(get().dataFolders, newFiles),
    });
  },
  deleteFile: (id) => {
    const newFiles = get().dataFiles.filter(f => f.id !== id);
    set({
      dataFiles: newFiles,
      nestedFolders: buildNestedStructure(get().dataFolders, newFiles),
    });
  },
}));
