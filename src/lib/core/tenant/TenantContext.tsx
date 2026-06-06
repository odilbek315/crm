import React, { createContext, useContext } from 'react';
import { useAuth } from '../auth/AuthContext';

interface Organization {
  id: string;
  name: string;
  domain: string;
}

interface TenantContextType {
  currentTenant: Organization | null;
  setCurrentTenant: (tenant: Organization) => void;
  availableTenants: Organization[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const currentTenant = user
    ? {
        id: user.organizationId,
        name: user.organizationName || 'Current Organization',
        domain: 'current.local',
      }
    : null;

  const availableTenants = currentTenant ? [currentTenant] : [];

  return (
    <TenantContext.Provider value={{ currentTenant, setCurrentTenant: () => {}, availableTenants }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
