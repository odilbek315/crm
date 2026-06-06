import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, ExternalLink, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const;

export function LeadsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    source: '',
    status: 'New',
    score: 0
  });

  const queryClient = useQueryClient();

  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await api.get('/leads');
      return res.data.data as any[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/leads', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, form: typeof formData }) => api.patch(`/leads/${data.id}`, data.form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setEditingLead(null);
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const handleOpenModal = (lead?: any) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        email: lead.email,
        company: lead.company || '',
        source: lead.source || '',
        status: lead.status || 'New',
        score: lead.score || 0
      });
    } else {
      setEditingLead(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', company: '', source: '', status: 'New', score: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      updateMutation.mutate({ id: editingLead.id, form: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredLeads = leads?.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Leads Pipeline</h1>
          <p className="text-white/60 mt-1 text-sm">Manage opportunities and track conversion stages.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
          <Plus className="size-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            className="pl-9 bg-black/40 border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="glass-card flex rounded-lg p-1 ml-auto w-full sm:w-auto overflow-hidden">
          <button 
            onClick={() => setView('kanban')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'kanban' ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-white/50" />
        </div>
      ) : error ? (
         <div className="p-12 text-center text-red-400">Failed to load leads</div>
      ) : view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 min-h-[500px]">
          <div className="flex gap-4 h-full min-w-max">
            {STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.status === stage);
              return (
                <div key={stage} className="glass-card w-80 flex flex-col gap-3 rounded-2xl p-4 shrink-0 transition-all hover:bg-black/20">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="font-semibold text-sm tracking-wide">{stage}</h3>
                    <Badge variant="secondary" className="bg-white/10">{stageLeads.length}</Badge>
                  </div>
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {stageLeads.map(lead => (
                      <LeadCard 
                        key={lead.id} 
                        lead={lead} 
                        onEdit={() => handleOpenModal(lead)} 
                        onDelete={() => deleteMutation.mutate(lead.id)} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden flex flex-col border-white/10 glass-card">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-medium">Lead Details</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground group-hover:text-sky-400 transition-colors">
                        <Link to={`/leads/${lead.id}`}>{lead.company || lead.name}</Link>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{lead.name} • {lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-white/5">{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {lead.score}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="size-8" onClick={() => handleOpenModal(lead)}>
                           <Edit className="size-4 text-muted-foreground hover:text-sky-400" />
                         </Button>
                         <Button variant="ghost" size="icon" className="size-8" onClick={() => deleteMutation.mutate(lead.id)}>
                           <Trash2 className="size-4 text-muted-foreground hover:text-red-400" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingLead ? 'Edit Lead' : 'New Lead'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Contact Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Email</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
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
                  {STAGES.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Score</label>
                <Input type="number" value={formData.score} onChange={e => setFormData({...formData, score: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-sky-500 hover:bg-sky-600 text-white">Save Lead</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, onEdit, onDelete }: { lead: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/5 outline outline-1 outline-transparent hover:outline-white/20 hover:bg-black/60 transition-all group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/leads/${lead.id}`} className="block">
          <div>
            <h4 className="font-semibold text-foreground text-sm hover:text-sky-400 transition-colors">{lead.company || lead.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{lead.name}</p>
          </div>
        </Link>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="icon" className="size-6 shrink-0 text-white/50 hover:text-white" onClick={(e) => { e.preventDefault(); onEdit(); }}>
             <Edit className="size-3" />
           </Button>
           <Button variant="ghost" size="icon" className="size-6 shrink-0 text-white/50 hover:text-red-400" onClick={(e) => { e.preventDefault(); onDelete(); }}>
             <Trash2 className="size-3" />
           </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 text-muted-foreground text-xs">
           Score: {lead.score}
        </div>
        <div className="font-mono text-xs font-medium text-accent">
          {new Date(lead.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
