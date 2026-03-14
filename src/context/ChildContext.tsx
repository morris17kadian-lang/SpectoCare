import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Child } from '../models';

interface ChildContextValue {
  children: Child[];
  selectedChild: Child | null;
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  selectChild: (child: Child) => void;
}

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

export const ChildProvider = ({ children: nodes }: { children: ReactNode }) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, selectChild] = useState<Child | null>(null);

  return (
    <ChildContext.Provider value={{ children, selectedChild, setChildren, selectChild }}>
      {nodes}
    </ChildContext.Provider>
  );
};

export const useChild = (): ChildContextValue => {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error('useChild must be used inside ChildProvider');
  return ctx;
};
