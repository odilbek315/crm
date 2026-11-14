import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface AuditLogData {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  changes?: any;
}

export function useAuditLogs() {
  return useQuery<AuditLogData[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await api.get('/audit-logs');
      return res.data;
    }
  });
}
