import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="size-8 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export function PermissionGuard({ requiredRole, children }: { requiredRole: string; children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator' || user?.role === 'ADMIN';
  
  if (!user || (!isAdmin && user.role !== requiredRole)) {
    return null; // Don't render content if unauthorized
  }

  return <>{children}</>;
}
