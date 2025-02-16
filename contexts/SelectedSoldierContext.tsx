'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { MockSoldier } from '@/utils/mockSoldierData';

interface SelectedSoldierContextType {
  selectedSoldier: MockSoldier | null;
  setSelectedSoldier: (soldier: MockSoldier | null) => void;
}

const SelectedSoldierContext = createContext<SelectedSoldierContextType | undefined>(undefined);

export function SelectedSoldierProvider({ children }: { children: ReactNode }) {
  const [selectedSoldier, setSelectedSoldier] = useState<MockSoldier | null>(null);

  return (
    <SelectedSoldierContext.Provider value={{ selectedSoldier, setSelectedSoldier }}>
      {children}
    </SelectedSoldierContext.Provider>
  );
}

export function useSelectedSoldier() {
  const context = useContext(SelectedSoldierContext);
  if (context === undefined) {
    throw new Error('useSelectedSoldier must be used within a SelectedSoldierProvider');
  }
  return context;
}
