import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface LeadData {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  status?: string;
  score?: number;
  createdAt?: string;
}

export function useLeads() {
  return useQuery<LeadData[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await api.get('/leads');
      return res.data;
    }
  });
}

export function useLeadDetail(id: string | null | undefined) {
  return useQuery<LeadData>({
    queryKey: ['leads', id],
    queryFn: async () => {
      const res = await api.get(`/leads/${id}`);
      return res.data;
    },
    enabled: !!id
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LeadData) => {
      const res = await api.post('/leads', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeadData> }) => {
      const res = await api.patch(`/leads/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}
