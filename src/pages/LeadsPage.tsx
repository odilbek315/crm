import React, { useState } from 'react';
import { Plus, Search, Loader2, Mail, Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useLeads } from '../frontend/hooks/useLeads';
import { Link } from 'react-router-dom';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const;

export function LeadsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch leads from database
  const { data: leads = [], isLoading, error } = useLeads();

  const filteredLeads = leads.filter(lead => 
    (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Leads Pipeline</h1>
          <p className="text-white/60 mt-1 text-sm">Manage opportunities and track conversion stages.</p>
        </div>
        <Button onClick={() => alert("Kompaniya lead yaratish funksiyasi batafsil ma'lumotlar sahifasi orqali qo'llab-quvvatlanadi.")} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] cursor-pointer">
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
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${view === 'kanban' ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${view === 'list' ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-white/50" />
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-400">Failed to load leads from server</div>
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
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="p-8 text-center text-xs text-white/20 border border-dashed border-white/5 rounded-xl">
                        Leadlar mavjud emas
                      </div>
                    )}
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
                  <th className="px-6 py-4 font-medium">Value</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground group-hover:text-sky-400 transition-colors">
                        <Link to={`/leads/${lead.id}`}>{lead.company || 'Yakka Tartibda'}</Link>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-white/5">{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      ${(lead.score || 0 * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/leads/${lead.id}`}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="size-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function LeadCard({ lead }: { lead: any }) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/5 outline outline-1 outline-transparent hover:outline-white/20 hover:bg-black/60 transition-all cursor-pointer group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <Link to={`/leads/${lead.id}`} className="block">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm group-hover:text-sky-400 transition-colors">{lead.company || 'Yakka Tartibda'}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{lead.name}</p>
          </div>
        </div>
      </Link>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 text-muted-foreground">
          <button className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/10"><Mail className="size-3.5" /></button>
          <button className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/10"><Phone className="size-3.5" /></button>
        </div>
        <div className="font-mono text-xs font-medium text-accent">
          Score: {lead.score || 0}
        </div>
      </div>
    </div>
  );
}

export default LeadsPage;
