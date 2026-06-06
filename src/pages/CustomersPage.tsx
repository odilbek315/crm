import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Download, ExternalLink, Loader2, Trash2, Edit, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formError, setFormError] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
    value: 0
  });

  const queryClient = useQueryClient();

  // Reset page when search or filter changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['customers', page, searchQuery, statusFilter],
    queryFn: async () => {
      const res = await api.get('/customers', {
        params: { page, limit: 10, search: searchQuery, status: statusFilter }
      });
      return res.data;
    }
  });

  const customers = responseData?.data || [];
  const meta = responseData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      const resData = err.response?.data;
      if (resData?.details) {
        setFormError(resData.details);
      } else {
        setFormError(resData?.error || 'Failed to save customer');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, form: typeof formData }) => api.patch(`/customers/${data.id}`, data.form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setEditingCustomer(null);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      const resData = err.response?.data;
      if (resData?.details) {
        setFormError(resData.details);
      } else {
        setFormError(resData?.error || 'Failed to save customer');
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const handleOpenModal = (customer?: any) => {
    setFormError(null);
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        status: customer.status,
        value: customer.value || 0
      });
    } else {
      setEditingCustomer(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '', status: 'Active', value: 0 });
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, form: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Customers</h1>
          <p className="text-white/60 mt-1 text-sm">Manage your active client base and segment profiles.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal()} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <Plus className="size-4 mr-2" />
            New Customer
          </Button>
        </div>
      </div>

      <Card className="flex flex-col min-h-[600px] overflow-hidden glass-card border-white/10 backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02]">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Search companies, emails..." 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="size-4 text-white/40" />
            <select
              className="bg-black/40 border border-white/10 text-white text-sm rounded-md h-10 px-3 min-w-[120px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All" className="bg-[#0a0a0a]">All Status</option>
              <option value="Active" className="bg-[#0a0a0a]">Active</option>
              <option value="Inactive" className="bg-[#0a0a0a]">Inactive</option>
              <option value="Lead" className="bg-[#0a0a0a]">Lead</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
               <Loader2 className="size-6 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load customers</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground uppercase bg-white/[0.01] border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium pl-6">Company/Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue</th>
                  <th className="px-6 py-4 font-medium text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-display font-bold text-xs border border-white/10">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{customer.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{customer.email} {customer.company && `• ${customer.company}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'} className="bg-opacity-10 shadow-none">
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      <span className="font-medium text-foreground">${(customer.value || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/customers/${customer.id}`}>
                          <Button variant="ghost" size="icon" className="size-8">
                            <ExternalLink className="size-4 text-muted-foreground hover:text-white" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => handleOpenModal(customer)}>
                          <Edit className="size-4 text-muted-foreground hover:text-sky-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => deleteMutation.mutate(customer.id)}>
                          <Trash2 className="size-4 text-muted-foreground hover:text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && customers.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No customers found.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="text-sm text-white/50">
              Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-black/40 border-white/10 text-white hover:bg-white/5"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="size-4 mr-1" /> Prev
              </Button>
              <div className="text-sm font-medium text-white px-2">Page {meta.page} of {meta.totalPages}</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-black/40 border-white/10 text-white hover:bg-white/5"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages || isLoading}
              >
                Next <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingCustomer ? 'Edit Customer' : 'New Customer'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  <div>
                    {Array.isArray(formError) ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {formError.map((err: any, i: number) => (
                          <li key={i}>{err.message}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{formError}</p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Email</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Phone</label>
                <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Company</label>
                <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Status</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active" className="bg-[#0a0a0a]">Active</option>
                  <option value="Inactive" className="bg-[#0a0a0a]">Inactive</option>
                  <option value="Lead" className="bg-[#0a0a0a]">Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Revenue Value</label>
                <Input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-sky-500 hover:bg-sky-600 text-white">
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Save Customer
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
