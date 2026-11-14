import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface CustomerData {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status?: string;
  value?: number;
}

export interface PaginatedCustomersResponse {
  data: CustomerData[];
  meta: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

// Hook to fetch paginated customer list
export function useCustomers(page: number, limit = 10) {
  return useQuery<PaginatedCustomersResponse>({
    queryKey: ['customers', page, limit],
    queryFn: async () => {
      const res = await api.get(`/customers`, {
        params: { page, limit }
      });
      return res.data;
    },
    staleTime: 10000, // 10 seconds stale time
  });
}

// Hook to create a new customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CustomerData) => {
      const res = await api.post('/customers', data);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate customer queries to force refresh the lists
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

// Hook to update an existing customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerData> }) => {
      const res = await api.patch(`/customers/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

// Hook to delete (soft delete) a customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}
