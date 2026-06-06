import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, ArrowRight, BarChart2, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const STAGES = ['Prospecting', 'Meeting Scheduled', 'Needs Analysis', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

export function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    value: 0,
    stage: 'Prospecting',
    expectedClose: '',
    customerId: ''
  });

  const queryClient = useQueryClient();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const res = await api.get('/deals');
      return res.data.data as any[];
    }
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return res.data.data as any[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/deals', {
      ...data, 
      expectedClose: data.expectedClose ? new Date(data.expectedClose).toISOString() : null,
      customerId: data.customerId || null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, form: typeof formData }) => api.patch(`/deals/${data.id}`, {
      ...data.form,
      expectedClose: data.form.expectedClose ? new Date(data.form.expectedClose).toISOString() : null,
      customerId: data.form.customerId || null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setEditingDeal(null);
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/deals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });

  const handleOpenModal = (deal?: any) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        title: deal.title,
        value: deal.value || 0,
        stage: deal.stage || 'Prospecting',
        expectedClose: deal.expectedClose ? new Date(deal.expectedClose).toISOString().split('T')[0] : '',
        customerId: deal.customerId || ''
      });
    } else {
      setEditingDeal(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', value: 0, stage: 'Prospecting', expectedClose: '', customerId: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      updateMutation.mutate({ id: editingDeal.id, form: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredDeals = deals?.filter(deal => 
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Sales Pipeline</h1>
          <p className="text-white/60 mt-1 text-sm">Track deals, opportunities, and revenue forecasting.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Plus className="size-4 mr-2" />
          New Deal
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <Input 
            placeholder="Search active deals..." 
            className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-hidden">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white/70 hover:text-white pointer-events-none">
            <Filter className="size-4 mr-2" /> All Pipelines
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-white/50" />
        </div>
      ) : error ? (
         <div className="p-12 text-center text-red-400">Failed to load deals</div>
      ) : (
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 min-h-[500px]">
          <div className="flex gap-4 h-full min-w-max">
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage);
              const totalValue = stageDeals.reduce((acc, curr) => acc + (curr.value || 0), 0);

              return (
                <div key={stage} className="glass-card w-80 flex flex-col gap-3 rounded-2xl p-4 shrink-0 hover:bg-black/20 transition-colors border-white/5">
                  <div className="flex flex-col gap-1 px-2 mb-2 pb-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm tracking-wide text-white/90">{stage}</h3>
                      <span className="text-xs text-white/50">{stageDeals.length} deals</span>
                    </div>
                    <p className="font-mono text-emerald-400 text-sm font-medium">${totalValue.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {stageDeals.map(deal => (
                      <div key={deal.id} className="p-4 rounded-xl bg-black/40 border border-white/5 outline outline-1 outline-transparent hover:outline-indigo-500/30 hover:bg-black/60 transition-all group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                         <div className="flex justify-between items-start mb-2">
                           <Link to={`/deals/${deal.id}`} className="block">
                             <h4 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">{deal.title}</h4>
                           </Link>
                           <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="size-6 shrink-0 text-white/50 hover:text-white" onClick={() => handleOpenModal(deal)}>
                               <Edit className="size-3" />
                             </Button>
                             <Button variant="ghost" size="icon" className="size-6 shrink-0 text-white/50 hover:text-red-400" onClick={() => deleteMutation.mutate(deal.id)}>
                               <Trash2 className="size-3" />
                             </Button>
                           </div>
                         </div>
                         <p className="text-xs text-white/40 mb-3 block text-emerald-400/80">
                           {deal.customer ? deal.customer.name : 'No Customer Attached'}
                         </p>
                         <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                           <div className="font-mono text-sm font-medium text-emerald-400/90">
                             ${(deal.value || 0).toLocaleString()}
                           </div>
                           <div className="text-[10px] text-white/50">
                             {deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'No Close Date'}
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingDeal ? 'Edit Deal' : 'New Deal'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Value ($)</label>
                <Input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Stage</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.stage}
                  onChange={e => setFormData({...formData, stage: e.target.value})}
                >
                  {STAGES.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Expected Close Date</label>
                <Input type="date" value={formData.expectedClose} onChange={e => setFormData({...formData, expectedClose: e.target.value})} className="bg-white/5 border-white/10" style={{colorScheme: 'dark'}} />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Customer</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.customerId}
                  onChange={e => setFormData({...formData, customerId: e.target.value})}
                >
                  <option value="" className="bg-[#0a0a0a]">-- Select Customer --</option>
                  {customers?.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-indigo-500 hover:bg-indigo-600 text-white">Save Deal</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
