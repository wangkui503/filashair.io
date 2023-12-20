'use client';

import React from 'react';

interface store {
  meta:{    
  }
}

const CounterContext = React.createContext<
  [store, React.Dispatch<React.SetStateAction<store>>] | undefined
>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = React.useState({meta:{}} as store);
  return (
    <CounterContext.Provider value={[count, setCount]}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const context = React.useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
}