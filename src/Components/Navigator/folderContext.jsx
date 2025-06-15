// src/Components/Navigator/FolderContext.jsx
import React, { createContext, useContext } from 'react';

const FolderContext = createContext(null);
export const useFolder = () => useContext(FolderContext);

export const FolderProvider = ({ folder, children }) => (
  <FolderContext.Provider value={folder}>
    {children}
  </FolderContext.Provider>
);
