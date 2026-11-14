import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface WorkflowRule {
  id: string;
  name: string;
  triggerEvent: string;
  criteria: {
    field: string;
    value: string;
  };
  actionType: string;
  isActive: boolean;
  description: string;
}

export interface WorkflowLog {
  id: string;
  userId: string;
  timestamp: string;
  details: {
    ruleName: string;
    actionTaken: 'CREATE_TASK' | 'GENERATE_DOCUMENT';
    createdEntityId: string;
    createdEntityTitle: string;
    details: string;
  } | null;
}

// Hook to load all workflow rules from backend
export function useWorkflows() {
  return useQuery<WorkflowRule[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const res = await api.get('/workflows');
      return res.data;
    },
    staleTime: 10000,
  });
}

// Hook to toggle rule active status
export function useToggleWorkflow() {
  const queryClient = useQueryClient();
  return useMutation<WorkflowRule, Error, string>({
    mutationFn: async (id) => {
      const res = await api.patch(`/workflows/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });
}

// Hook to load execution activity logs
export function useWorkflowLogs() {
  return useQuery<WorkflowLog[]>({
    queryKey: ['workflows', 'logs'],
    queryFn: async () => {
      const res = await api.get('/workflows/logs');
      return res.data;
    },
    staleTime: 5000,
  });
}
