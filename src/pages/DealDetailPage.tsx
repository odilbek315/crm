import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ChevronLeft, Target, Briefcase, Calendar, Building2, CheckSquare, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: async () => {
      const res = await api.get(`/deals/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const tabs = ['Overview', 'Stage History', 'Activities', 'Tasks', 'Documents'];

  const dealStages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="p-12 text-center text-red-400">Failed to load deal details.</div>
    );
  }

  const currentStageIndex = dealStages.findIndex(s => s === deal.stage) !== -1 ? dealStages.findIndex(s => s === deal.stage) : 0;
  const customer = deal.customer;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center gap-4 shrink-0 mb-2">
        <Link to="/sales">
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white rounded-full bg-black/40 border border-white/5">
             <ChevronLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">{deal.title}</h1>
          <p className="text-white/60 mt-1 text-sm flex items-center gap-2">
            <Building2 className="size-4" /> {customer?.name || 'Unknown Customer'} • Expected Close: {deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'None'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 shrink-0">
        <Card className="glass-card border-white/10 p-6 md:col-span-3">
           <p className="text-xs text-white/40 uppercase tracking-wider mb-4 font-semibold">Deal Pipeline Stage</p>
           <div className="relative pt-4 pb-2">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full z-0" />
              <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000" style={{ width: `${(currentStageIndex / (dealStages.length - 1)) * 100}%` }} />
              
              <div className="relative z-10 flex justify-between">
                {dealStages.map((stage, idx) => (
                  <div key={stage} className="flex flex-col items-center gap-2 max-w-[80px]">
                    <div className={`size-4 rounded-full border-2 transition-colors ${
                      idx <= currentStageIndex 
                        ? 'bg-emerald-500 border-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                        : 'bg-black border-white/20'
                    }`} />
                    <span className={`text-[10px] font-medium text-center ${idx <= currentStageIndex ? 'text-white' : 'text-white/40'}`}>
                      {stage.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
           </div>
        </Card>

        <Card className="glass-card border-white/10 p-6 flex flex-col justify-center items-center text-center">
           <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Deal Value</p>
           <p className="text-4xl font-display font-bold text-white glow-text">${(deal.value || 0).toLocaleString()}</p>
        </Card>
      </div>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg transition-colors text-sm font-medium border-b-2 ${
              activeTab === tab 
                ? 'text-white border-emerald-500 bg-emerald-500/10' 
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Deal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Deal Value</span>
                   <span className="text-sm font-mono text-emerald-400">${(deal.value || 0).toLocaleString()}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Created Date</span>
                   <span className="text-sm font-medium text-white">{new Date(deal.createdAt).toLocaleDateString()}</span>
                 </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Related Customer Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {customer ? (
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                       <div className="size-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl font-bold border border-indigo-500/30">
                         {customer.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-medium text-white">{customer.name}</p>
                         <p className="text-sm text-white/50">{customer.industry || 'Unknown Industry'}</p>
                       </div>
                     </div>
                     <Link to={`/customers/${customer.id}`}>
                       <Button variant="outline" className="w-full mt-4 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5">
                         View Full Profile
                       </Button>
                     </Link>
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">Customer data not available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
