import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface ProcessMiningResponse {
  customerToDealDays: string;
  dealToInvoiceDays: string;
  totalCycleDays: string;
  bottlenecksDetected: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CopilotResponse {
  reply: string;
}

// Hook to fetch live process mining metrics from the backend audit logs
export function useProcessMining() {
  return useQuery<ProcessMiningResponse>({
    queryKey: ['analytics', 'process-mining'],
    queryFn: async () => {
      const res = await api.get('/analytics/process-mining');
      return res.data;
    },
    staleTime: 10000, // Keep fresh for 10 seconds
  });
}

// Mutation to execute multi-turn, context-aware chat with the virtual executive copilot
export function useCopilotChat() {
  return useMutation<CopilotResponse, Error, { query: string; history?: ChatMessage[] }>({
    mutationFn: async (payload) => {
      const res = await api.post('/ai/copilot', payload);
      return res.data;
    }
  });
}

export interface DashboardSummaryResponse {
  totalCustomers: number;
  totalDeals: number;
  newLeadsCount: number;
  inProgressLeadsCount: number;
  todayTasksCount: number;
  monthlyRevenue: number;
  topEmployees: any[];
  topCustomers: any[];
  activityFeed: any[];
  approvalQueue: any[];
  pendingTasks: any[];
}

export function useDashboardSummary() {
  return useQuery<DashboardSummaryResponse>({
    queryKey: ['analytics', 'dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard-summary');
      return res.data;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
}

