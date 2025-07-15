"use client";

import { Sidebar } from "./sidebar";
import Header from "./header";
import ProtectedRoute from "./protected-route";
import { Toaster } from "react-hot-toast";

interface MainLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function MainLayout({ children, allowedRoles }: MainLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Toaster />
    </ProtectedRoute>
  );
}
