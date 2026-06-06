import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AIEngine } from '../lib/core/ai/AIEngine';
import { useTenant } from '../lib/core/tenant/TenantContext';
import { BrainCircuit, Activity, ShieldCheck, Zap, Bot, Settings, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function IntelligencePage() {
  const { currentTenant } = useTenant();
  const agents = AIEngine.getAgents();
  const insights = AIEngine.getInsights(currentTenant?.id || 'org-1');

  const getAgentIcon = (role: string) => {
    switch(role) {
      case 'CEOAssistant': return <BrainCircuit className="size-5" />;
      case 'SalesManager': return <TrendingUp className="size-5" />;
      case 'BusinessAnalyst': return <Activity className="size-5" />;
      case 'HRAssistant': return <ShieldCheck className="size-5" />;
      case 'WorkflowAssistant': return <Zap className="size-5" />;
      default: return <Bot className="size-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">AI Command Center</h1>
          <p className="text-white/60 mt-1 text-sm">Manage simulated intelligence agents and platform-wide insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* System wide AI stats */}
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center border-t-2 border-t-purple-500">
           <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Active Agents</p>
           <p className="text-4xl font-display font-bold text-white glow-text">5</p>
         </Card>
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center border-t-2 border-t-sky-500">
           <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Decisions Made</p>
           <p className="text-4xl font-display font-bold text-white glow-text">8,421</p>
         </Card>
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center border-t-2 border-t-emerald-500">
           <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Avg Confidence</p>
           <p className="text-4xl font-display font-bold text-white glow-text">92.4%</p>
         </Card>
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center border-t-2 border-t-amber-500">
           <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Processing Load</p>
           <p className="text-4xl font-display font-bold text-white glow-text">24%</p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg text-white">Agent Registry</CardTitle>
              <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
                <Settings className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.role} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 gap-4">
                     <div className="flex items-center gap-4">
                       <div className={`size-10 rounded-lg flex items-center justify-center border ${
                         agent.status === 'Online' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                         agent.status === 'Processing' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                         'bg-white/5 text-white/40 border-white/10'
                       }`}>
                         {getAgentIcon(agent.role)}
                       </div>
                       <div>
                         <h4 className="font-semibold text-white">{agent.role.replace(/([A-Z])/g, ' $1').trim()}</h4>
                         <div className="flex items-center gap-2 mt-1">
                           <Badge className={`text-[10px] uppercase font-semibold ${
                             agent.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400' :
                             agent.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' :
                             'bg-white/10 text-white/50'
                           } border-transparent`}>
                             {agent.status}
                           </Badge>
                           <span className="text-xs text-white/40">Health: {agent.healthScore}%</span>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center sm:text-right gap-4 sm:gap-6">
                        <div className="flex flex-col">
                          <span className="text-xs text-white/40 uppercase tracking-wider">Tasks Done</span>
                          <span className="text-sm font-mono text-white/80">{agent.tasksCompleted.toLocaleString()}</span>
                        </div>
                        <Button variant="outline" className="border-white/10 bg-white/5 text-white/70 hover:text-white">View Log</Button>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-white/10 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-white">Live AI Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-sky-500/20 before:via-white/10 before:to-transparent">
                {insights.map(insight => (
                  <div key={insight.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/10 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 box-border ${
                      insight.type === 'Alert' || insight.type === 'Risk' ? 'bg-red-500/20 text-red-400' :
                      insight.type === 'Opportunity' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-black text-sky-400'
                    }`}>
                      {insight.type === 'Risk' ? <AlertTriangle className="size-4" /> : <BrainCircuit className="size-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/50">{insight.agentRole}</span>
                        <span className="text-[10px] text-white/30">{new Date(insight.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm font-semibold text-white/90 leading-tight mb-2">{insight.title}</p>
                      <p className="text-xs text-white/60">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
