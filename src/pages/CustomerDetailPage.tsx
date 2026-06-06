import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Mail, Phone, MapPin, Briefcase, Calendar, ChevronLeft, Building2, Plus, Clock, FileText, CheckSquare, Target, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function CustomerDetailPage() {
  const { id } = useParams();
  
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const res = await api.get(`/customers/${id}`);
      return res.data;
    }
  });

  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Timeline', 'Deals', 'Tasks', 'Documents', 'Invoices', 'Notes', 'Activity'];

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="size-8 animate-spin text-white/50" /></div>;
  if (error || !customer) return <div className="p-12 text-center text-red-400">Failed to load customer</div>;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center gap-4 shrink-0 mb-2">
        <Link to="/customers">
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white rounded-full bg-black/40 border border-white/5">
             <ChevronLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">{customer.name}</h1>
          <p className="text-white/60 mt-1 text-sm flex items-center gap-2">
            <Building2 className="size-4" /> {customer.company || 'N/A'} • ID: {customer.id}
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <Button className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <Plus className="size-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg transition-colors text-sm font-medium border-b-2 ${
              activeTab === tab 
                ? 'text-white border-sky-500 bg-sky-500/10' 
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 glass-card border-white/10 h-max">
              <CardContent className="p-6">
                <div className="size-20 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-3xl font-bold mb-6">
                  {customer.name.charAt(0)}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Status</p>
                    <Badge className={customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Total Revenue</p>
                    <p className="text-xl font-mono text-white glow-text">${(customer.value || 0).toLocaleString()}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <Mail className="size-4 text-white/40" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <Phone className="size-4 text-white/40" />
                      {customer.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <Calendar className="size-4 text-white/40" />
                      Since {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/50">Deal and Activity mock data has been cleared. This module now serves strictly production data.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab !== 'Overview' && (
          <div className="flex flex-col items-center justify-center h-64 text-white/30 border border-dashed border-white/10 rounded-xl">
             <Target className="size-10 mb-4 opacity-50" />
             <p>Data for {activeTab} is currently being synchronized.</p>
          </div>
        )}

      </div>
    </div>
  );
}
