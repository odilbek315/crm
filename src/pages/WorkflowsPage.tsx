import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { mockWorkflows } from '../data/mockData';
import { GitBranch, Plus, Play, Pause, Settings2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Automation Workflows</h1>
          <p className="text-white/60 mt-1 text-sm">Visual engine for business process automation.</p>
        </div>
        <Button className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
          <Plus className="size-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-6">
        {mockWorkflows.map(wf => (
          <Card key={wf.id} className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1 h-full ${wf.isActive ? 'bg-emerald-500' : 'bg-white/10'}`} />
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">{wf.name}</h3>
                    <Badge className={wf.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/50 border-white/10'}>
                      {wf.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5">
                      <span className="text-white/40 uppercase text-[10px] tracking-wider font-semibold">Trigger:</span>
                      <span className="text-white/90 font-medium">{wf.trigger}</span>
                    </div>
                    {wf.conditions.length > 0 && <span className="text-white/30 text-xs">→</span>}
                    {wf.conditions.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase text-[10px] tracking-wider font-semibold">IF:</span>
                        <span className="text-white/90 font-medium">{wf.conditions.join(' AND ')}</span>
                      </div>
                    )}
                    <span className="text-white/30 text-xs">→</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-200">
                      <span className="text-sky-400/60 uppercase text-[10px] tracking-wider font-semibold">THEN:</span>
                      <span className="font-medium">{wf.actions.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                    <Settings2 className="size-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5 w-24">
                    {wf.isActive ? (
                      <><Pause className="size-4 mr-2" /> Pause</>
                    ) : (
                      <><Play className="size-4 mr-2" /> Enable</>
                    )}
                  </Button>
                </div>
                
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
