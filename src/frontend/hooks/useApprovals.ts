import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface ApprovalData {
  id?: string;
  title: string;
  type?: string;
  status?: string;
  requesterId?: string;
  amount?: number;
  createdAt?: string;
  requester?: {
    name: string;
    role: string;
    email: string;
  };
}

export function useApprovals() {
  return useQuery<ApprovalData[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      const res = await api.get('/approvals');
      return res.data;
    }
  });
}

export function useCreateApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApprovalData) => {
      const res = await api.post('/approvals', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    }
  });
}

export function useUpdateApprovalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'Approved' | 'Rejected' }) => {
      const res = await api.patch(`/approvals/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    }
  });
}
