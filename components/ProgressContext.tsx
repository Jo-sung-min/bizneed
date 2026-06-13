"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ProgressContextType = {
  completed: string[];
  toggleTask: (id: string) => void;
  total: number;
  percent: number;
};

const taskIds = [
  "type", "industry", "name", "lease", "id-card", "permit",
  "login", "form", "submit", "certificate", "account", "tax",
];

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bizneed-progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleTask = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("bizneed-progress", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({
    completed,
    toggleTask,
    total: taskIds.length,
    percent: Math.round((completed.length / taskIds.length) * 100),
  }), [completed]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used within ProgressProvider");
  return context;
}
