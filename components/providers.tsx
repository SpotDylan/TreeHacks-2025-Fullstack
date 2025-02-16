'use client';

import { useState } from 'react';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { SelectedSoldierProvider } from '@/contexts/SelectedSoldierContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);

  return (
    <DemoModeProvider isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode}>
      <SelectedSoldierProvider>
        {children}
      </SelectedSoldierProvider>
    </DemoModeProvider>
  );
}
