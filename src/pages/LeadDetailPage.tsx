import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Mail, Phone, Clock, Target, Trophy, Flame, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useLeadDetail } from '../frontend/hooks/useLeads';
import { useAuditLogs } from '../frontend/hooks/useAuditLogs';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Profile');

  // Fetch lead details and audit log
  const { data: lead, isLoading, error } = useLeadDetail(id);
  const { data: auditLogs = [] } = useAuditLogs();

  const tabs = ['Profile', 'Timeline'];

  const workflowStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const currentStageIndex = lead ? workflowStages.findIndex(s => s === lead.status) : 0;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-sky-400" />
        <span className="ml-3 text-white/70">Lead ma'lumotlari yuklanmoqda...</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-12 text-center text-red-400">
        Lead topilmadi yoki yuklashda xatolik yuz berdi.
        <br />
        <Link to="/leads" className="text-sky-400 hover:underline mt-4 inline-block">Ortga qaytish</Link>
      </div>
    );
  }

  const leadActivities = auditLogs.filter(log => log.entityId === id && log.entityType === 'Lead');

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center gap-4 shrink-0 mb-2">
        <Link to="/leads">
          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white rounded-full bg-black/40 border border-white/5">
             <ChevronLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">{lead.company || 'Yakka Tartibda'}</h1>
          <p className="text-white/60 mt-1 text-sm flex items-center gap-2">
            <Target className="size-4" /> {lead.name} • Lead Source: {lead.source || 'Noma\'lum'}
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <Button onClick={() => alert("Ushbu leadni bitimga (deal) aylantirish jarayoni bitimlar bo'limida amalga oshiriladi.")} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] cursor-pointer">
            <Trophy className="size-4 mr-2" />
            Convert to Deal
          </Button>
        </div>
      </div>

      <Card className="glass-card border-white/10 p-6 shrink-0">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 max-w-2xl relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full z-0" />
              <div className="absolute top-1/2 left-0 h-1 bg-sky-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000" style={{ width: `${(currentStageIndex / (workflowStages.length - 1)) * 100}%` }} />
              
              <div className="relative z-10 flex justify-between">
                {workflowStages.map((stage, idx) => (
                  <div key={stage} className="flex flex-col items-center gap-2">
                    <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                      idx <= currentStageIndex 
                        ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(14,165,233,0.5)]' 
                        : 'bg-black/60 border-white/20 text-white/40'
                    }`}>
                      {idx < currentStageIndex ? '✓' : idx + 1}
                    </div>
                    <span className={`text-xs font-medium ${idx <= currentStageIndex ? 'text-white' : 'text-white/40'}`}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-xl bg-black/40 border border-white/5 shrink-0">
               <div className="text-center border-r border-white/10 pr-6">
                 <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Lead Score</p>
                 <div className="flex items-center gap-2 justify-center">
                   <Flame className={`size-5 ${(lead.score || 0) > 70 ? 'text-red-500' : 'text-amber-500'}`} />
                   <span className="text-2xl font-bold text-white">{lead.score || 0}</span>
                 </div>
               </div>
               <div className="text-center">
                 <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Status</p>
                 <span className="text-sm font-medium text-white">{lead.status}</span>
               </div>
            </div>
         </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg transition-colors text-sm font-medium border-b-2 cursor-pointer ${
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
        {activeTab === 'Profile' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Full Name</span>
                   <span className="text-sm font-medium text-white">{lead.name}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Email</span>
                   <span className="text-sm font-medium text-white">{lead.email}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Phone</span>
                   <span className="text-sm font-medium text-white">{lead.phone || 'Kiritilmagan'}</span>
                 </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Lead Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Company Name</span>
                   <span className="text-sm font-medium text-white">{lead.company || 'Yakka Tartibda'}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                   <span className="text-sm text-white/50">Source</span>
                   <span className="text-sm font-medium text-white">{lead.source || 'Noma\'lum'}</span>
                 </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'Timeline' && (
           <Card className="glass-card border-white/10 p-6">
             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
               {leadActivities.map((activity) => (
                 <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                   <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/80 text-sky-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 box-border">
                     <Clock className="size-4" />
                   </div>
                   <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                     <div className="flex items-center justify-between mb-1">
                       <span className="font-semibold text-white">{activity.action.replace(/_/g, ' ')}</span>
                       <span className="text-xs text-white/50">{new Date(activity.timestamp).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-white/70">
                       {activity.action === 'CREATE_LEAD' ? "Lead was created in the system." : `Lead field was modified. Details: ${JSON.stringify(activity.changes)}`}
                     </p>
                   </div>
                 </div>
               ))}
               {leadActivities.length === 0 && (
                 <p className="text-sm text-white/40 text-center py-4">Hozircha faolliklar tarixi mavjud emas.</p>
               )}
             </div>
           </Card>
        )}
      </div>
    </div>
  );
}

export default LeadDetailPage;
