'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminSidebarContextValue {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(
  null
);

interface AdminSidebarProviderProps {
  children: ReactNode;
}

export function AdminSidebarProvider({ children }: AdminSidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    setCollapsed((current) => !current);
  }

  return (
    <AdminSidebarContext.Provider
      value={{
        collapsed,
        toggleSidebar
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);

  if (!context) {
    throw new Error('useAdminSidebar must be used inside AdminSidebarProvider');
  }

  return context;
}
