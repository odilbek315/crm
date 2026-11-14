import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface DealData {
  id: string;
  title: string;
  value: number;
  stage: string;
  expectedClose: string | null;
  customerId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customer?: {
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
  } | null;
}

export interface DealHistoryItem {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  changes: {
    previousStage: string;
    newStage: string;
    notes: string;
    dealTitle: string;
    dealValue: number;
  } | null;
}

export interface StageUpdateResponse {
  deal: DealData;
  aiForecast: {
    winProbability: number;
    recommendations: string[];
  };
}

// Hook to load all deals for the Kanban board
export function useDealsKanban() {
  return useQuery<DealData[]>({
    queryKey: ['deals', 'kanban'],
    queryFn: async () => {
      const res = await api.get('/deals/kanban');
      return res.data;
    },
    staleTime: 10000, // 10 seconds stale time
  });
}

// Hook to get transition history for a deal
export function useDealHistory(dealId: string | null) {
  return useQuery<DealHistoryItem[]>({
    queryKey: ['deals', 'history', dealId],
    queryFn: async () => {
      if (!dealId) return [];
      const res = await api.get(`/deals/${dealId}/history`);
      return res.data;
    },
    enabled: !!dealId, // Only fetch when dealId is provided
    staleTime: 5000,
  });
}

// Hook to update a deal's stage (triggering audit logs and AI evaluation)
export function useUpdateDealStage() {
  const queryClient = useQueryClient();
  return useMutation<StageUpdateResponse, Error, { id: string; stage: string; notes?: string }>({
    mutationFn: async ({ id, stage, notes }) => {
      const res = await api.patch(`/deals/${id}/stage`, { stage, notes });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both Kanban and history queries for this specific deal to update UI
      queryClient.invalidateQueries({ queryKey: ['deals', 'kanban'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'history', variables.id] });
    }
  });
}
