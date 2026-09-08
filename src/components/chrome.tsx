"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type ChromeContextValue = {
  preparing: boolean;
  setPreparing: (preparing: boolean) => void;
};

const ChromeContext = createContext<ChromeContextValue | null>(null);

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [preparing, setPreparing] = useState(false);

  return (
    <ChromeContext.Provider value={{ preparing, setPreparing }}>
      {children}
    </ChromeContext.Provider>
  );
}

export function useChrome() {
  const context = useContext(ChromeContext);
  if (!context) {
    throw new Error("useChrome must be used within ChromeProvider");
  }
  return context;
}
