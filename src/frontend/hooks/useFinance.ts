import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface ProductData {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: string;
  brand?: string | null;
}

export interface InvoiceItemData {
  id: string;
  quantity: number;
  price: number;
  invoiceId: string;
  productId: string;
  product?: ProductData;
}

export interface InvoiceData {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    company?: string | null;
  };
  organizationId: string;
  items?: InvoiceItemData[];
  createdAt: string;
}

export interface PaginatedInvoicesResponse {
  data: InvoiceData[];
  meta: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface FinanceStatsResponse {
  totalRevenue: number;
  outstandingReceivables: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  totalInvoicesCount: number;
  paidRatio: number;
  inventoryValuation: number;
  cashFlow: { month: string; income: number; expense: number }[];
}

export interface CreateInvoicePayload {
  customerId: string;
  dueDate: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

// Hook to fetch financial stats (Total Revenue, Outstanding Receivables, etc.)
export function useFinanceStats() {
  return useQuery<FinanceStatsResponse>({
    queryKey: ['finance', 'stats'],
    queryFn: async () => {
      const res = await api.get('/finance/dashboard');
      return res.data;
    },
    staleTime: 5000, // Refresh every 5 seconds or keep fresh
  });
}

// Alias to match implementation plan naming
export const useFinancialMetrics = useFinanceStats;

// Hook to fetch paginated invoices
export function useInvoices(page: number, limit = 10) {
  return useQuery<PaginatedInvoicesResponse>({
    queryKey: ['invoices', page, limit],
    queryFn: async () => {
      const res = await api.get('/finance/invoices', {
        params: { page, limit }
      });
      return res.data;
    },
    staleTime: 5000,
  });
}

// Hook to fetch products for invoice line items selection
export function useProducts() {
  return useQuery<ProductData[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/finance/products');
      return res.data;
    },
    staleTime: 10000,
  });
}

// Hook to create a new invoice (Safe transaction calculations strictly on backend)
export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInvoicePayload) => {
      const res = await api.post('/finance/invoices', payload);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate query caches to trigger UI refresh
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refetches stock levels
    }
  });
}

// Hook to mark an invoice as Paid (Triggers Workflow Engine trigger inside backend)
export function usePayInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/finance/invoices/${id}/pay`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      // Invalidate workflow logs so that the "Automation Activity Logs" timeline refreshes with the execution log!
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });
}
