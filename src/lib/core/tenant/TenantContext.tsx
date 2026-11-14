import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../api';

interface Organization {
  id: string;
  name: string;
}

interface TenantContextType {
  currentTenant: Organization | null;
  setCurrentTenant: (tenant: Organization) => Promise<void>;
  availableTenants: Organization[];
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [availableTenants, setAvailableTenants] = useState<Organization[]>([]);
  const [currentTenant, setCurrentTenantState] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTenants() {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Parse current organizationId from JWT token
        let currentOrgId = '';
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentOrgId = payload.organizationId;
        } catch (e) {
          console.error('Failed to parse JWT payload', e);
        }

        const res = await api.get('/auth/organizations');
        const orgs = res.data;
        setAvailableTenants(orgs);

        const active = orgs.find((o: any) => o.id === currentOrgId) || orgs[0] || null;
        setCurrentTenantState(active);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenants();
  }, []);

  const setCurrentTenant = async (tenant: Organization) => {
    try {
      const res = await api.post('/auth/switch-tenant', { organizationId: tenant.id });
      localStorage.setItem('token', res.data.token);
      // Hard refresh to reset React Query caches and Auth context
      window.location.reload();
    } catch (e) {
      console.error('Failed to switch organization context:', e);
    }
  };

  return (
    <TenantContext.Provider value={{ currentTenant, setCurrentTenant, availableTenants, isLoading }}>
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
