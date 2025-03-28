"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchModeContextType {
  activeSearchModes: Set<string>;
  toggleSearchMode: (modeId: string) => void;
}

const SearchModeContext = createContext<SearchModeContextType | undefined>(undefined);

export function SearchModeProvider({ children }: { children: ReactNode }) {
  const [activeSearchModes, setActiveSearchModes] = useState<Set<string>>(new Set(["normal"]));

  const toggleSearchMode = (modeId: string) => {
    const newModes = new Set(activeSearchModes);
    if (newModes.has(modeId)) {
      if (newModes.size > 1) {
        newModes.delete(modeId);
      }
    } else {
      newModes.add(modeId);
    }
    setActiveSearchModes(newModes);
  };

  return (
    <SearchModeContext.Provider value={{ activeSearchModes, toggleSearchMode }}>
      {children}
    </SearchModeContext.Provider>
  );
}

export function useSearchMode() {
  const context = useContext(SearchModeContext);
  if (context === undefined) {
    throw new Error('useSearchMode must be used within a SearchModeProvider');
  }
  return context;
} 