import React from 'react';
import { Card } from '../components/ui/card';
import { 
  GitBranch, Plus, Play, Pause, Settings2, Loader2, 
  Sparkles, CheckSquare, FileText, Clock, RefreshCw 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  useWorkflows, 
  useToggleWorkflow, 
  useWorkflowLogs 
} from '../frontend/hooks/useWorkflows';

export function WorkflowsPage() {
  const { data: rules = [], isLoading: isRulesLoading, error: rulesError } = useWorkflows();
  const { data: logs = [], isLoading: isLogsLoading, refetch: refetchLogs } = useWorkflowLogs();
  
  const toggleWorkflowMutation = useToggleWorkflow();

  const handleToggle = (id: string) => {
    toggleWorkflowMutation.mutate(id);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Automation Workflows</h1>
          <p className="text-white/60 mt-1 text-sm">Visual engine for event-driven business process automation.</p>
        </div>
        <Button className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] cursor-pointer">
          <Plus className="size-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Rules Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90 px-1">Active Rules Registry</h2>
        
        {isRulesLoading ? (
          <div className="flex h-40 items-center justify-center glass-card border-white/10 rounded-2xl">
            <Loader2 className="size-8 animate-spin text-white/40" />
          </div>
        ) : rulesError ? (
          <div className="p-12 text-center text-red-400 glass-card border-white/10 rounded-2xl">
            Failed to load workflow rules from server.
          </div>
        ) : (
          <div className="grid gap-4">
            {rules.map(wf => (
              <Card key={wf.id} className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${wf.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">{wf.name}</h3>
                        <Badge className={`shadow-none font-medium ${
                          wf.isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-white/5 text-white/40 border-white/10'
                        }`}>
                          {wf.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-white/50">{wf.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5">
                          <span className="text-white/40 uppercase text-[9px] tracking-wider font-semibold">Trigger:</span>
                          <span className="text-white/90 font-medium text-xs">{wf.triggerEvent}</span>
                        </div>
                        <span className="text-white/30 text-xs">→</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5">
                          <span className="text-white/40 uppercase text-[9px] tracking-wider font-semibold">IF:</span>
                          <span className="text-white/90 font-medium text-xs">stage = "{wf.criteria.value}"</span>
                        </div>
                        <span className="text-white/30 text-xs">→</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-200">
                          <span className="text-sky-400/60 uppercase text-[9px] tracking-wider font-semibold">THEN:</span>
                          <span className="font-medium text-xs">{wf.actionType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5 cursor-pointer">
                        <Settings2 className="size-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggle(wf.id)}
                        disabled={toggleWorkflowMutation.isPending}
                        className={`w-28 cursor-pointer shadow-none ${
                          wf.isActive 
                            ? 'border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                            : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300'
                        }`}
                      >
                        {toggleWorkflowMutation.isPending ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : wf.isActive ? (
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
        )}
      </div>

      {/* Execution Logs Section */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-semibold text-white/90">Automation Activity Logs</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetchLogs()} 
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <RefreshCw className="size-3.5 mr-2" /> Refresh Logs
          </Button>
        </div>

        <Card className="glass-card border-white/10 p-6 rounded-2xl min-h-[250px] relative overflow-hidden">
          {isLogsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader2 className="size-6 animate-spin text-white/40" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-white/40 space-y-2">
              <Clock className="size-8 text-white/20" />
              <p className="text-sm">No automation runs recorded yet.</p>
              <p className="text-xs text-white/30">Trigger rules by updating deal stages on the Sales Pipeline page.</p>
            </div>
          ) : (
            <div className="space-y-6 relative pl-6 border-l border-white/10 ml-2">
              {logs.map((log) => {
                const isTask = log.details?.actionTaken === 'CREATE_TASK';
                return (
                  <div key={log.id} className="relative group">
                    {/* Timeline bullet */}
                    <div className={`absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-[#09090b] flex items-center justify-center ${
                      isTask ? 'bg-sky-500' : 'bg-emerald-500'
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-white/40">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-white/70">{log.details?.ruleName}</span>
                        <span>•</span>
                        <span>Triggered successfully</span>
                      </div>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="mt-2 p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex gap-3 items-start">
                      <div className={`p-2 rounded-lg ${
                        isTask ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {isTask ? <CheckSquare className="size-4" /> : <FileText className="size-4" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white">
                          {isTask ? 'Auto-created Task' : 'Auto-generated Document'}: <span className="font-mono text-xs font-normal text-white/60">"{log.details?.createdEntityTitle}"</span>
                        </div>
                        <p className="text-xs text-white/60 italic">
                          "{log.details?.details}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
export default WorkflowsPage;
