"use client";

import { ProgressProvider } from "./ProgressContext";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <Sidebar />
      <main className="main-content">{children}</main>
    </ProgressProvider>
  );
}
