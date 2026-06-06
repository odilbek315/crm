import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AIEngine } from '../lib/core/ai/AIEngine';
import { useTenant } from '../lib/core/tenant/TenantContext';
import { Presentation, TrendingUp, Users, DollarSign, Target, Activity, ShieldAlert, ArrowUpRight, ArrowDownRight, Briefcase, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/Toast';

export function WarRoomPage() {
  const { currentTenant } = useTenant();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthScore, setHealthScore] = useState(92);
  const { toast } = useToast();
  
  const insights = AIEngine.getInsights(currentTenant?.id || 'org-1');
  const ceoInsight = insights.find(i => i.agentRole === 'CEOAssistant');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setHealthScore(Math.floor(Math.random() * (99 - 85 + 1) + 85));
      toast({
        title: "Tizim Yangilandi",
        description: "Barcha ko'rsatkichlar sun'iy intellekt tomonidan qayta hisoblab chiqildi.",
        type: "success"
      });
    }, 2000);
  };

  const handleAlertDismiss = (id: string) => {
    toast({
      title: "Alert Dismissed",
      description: "Ogohlantirish e'tiborsiz qoldirildi va arxivlandi.",
      type: "info"
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white glow-text uppercase">Executive War Room</h1>
          <p className="text-purple-300 mt-1 text-sm font-mono tracking-widest uppercase">CEO Command Center • Global Overview</p>
        </div>
        <div className="flex gap-4 items-center">
           <Button 
             variant="outline" 
             size="sm" 
             onClick={handleRefresh} 
             disabled={isRefreshing}
             className="border-white/10 text-white/70 hover:text-white bg-transparent h-10 px-4"
           >
             {isRefreshing ? <Loader2 className="size-4 mr-2 animate-spin" /> : <RefreshCcw className="size-4 mr-2" />}
             Live Sync
           </Button>
           <div className="text-right border-l border-white/10 pl-4">
             <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Company Health Score</p>
             <div className="flex items-center gap-2 justify-end text-emerald-400">
                <Activity className="size-6" />
                <span className="text-3xl font-display font-bold transition-all">{healthScore}</span><span className="text-xl text-white/30">/100</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
         {/* Center Main Stage */}
         <div className="lg:col-span-8 space-y-6">
            
            <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-black to-black border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Presentation className="size-32 text-indigo-400" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="inline-flex px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
                  AI Executive Summary
                </div>
                <h2 className="text-2xl font-semibold text-white leading-tight max-w-2xl">
                  {ceoInsight?.description || 'System health is optimal. Revenue is trending up 14% MoM.'}
                </h2>
                
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="space-y-1">
                    <p className="text-white/40 text-xs uppercase tracking-wider">Projected ARR</p>
                    <p className="text-2xl font-mono text-emerald-400">$4.2M <ArrowUpRight className="inline size-4" /></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/40 text-xs uppercase tracking-wider">Burn Rate</p>
                    <p className="text-2xl font-mono text-white/80">$125K</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/40 text-xs uppercase tracking-wider">Runway</p>
                    <p className="text-2xl font-mono text-white/80">32 Months</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="glass-card border-white/10 p-6 flex flex-col">
                 <div className="flex items-center gap-2 mb-6">
                   <Target className="size-5 text-amber-400" />
                   <h3 className="text-lg font-semibold text-white">AI Sales Prioritization</h3>
                 </div>
                 <div className="space-y-4 flex-1">
                   {[
                     { name: 'Acme Corp Upgrade', val: '$150k', prob: 88, risk: 'Low' },
                     { name: 'Global Tech Migration', val: '$85k', prob: 75, risk: 'Med' },
                     { name: 'Stark Ind. License', val: '$200k', prob: 45, risk: 'High' }
                   ].map((opp, i) => (
                     <div 
                       key={i} 
                       className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                       onClick={() => toast({ title: opp.name, description: `Win Probability: ${opp.prob}%. CRM orqali sotuv menejeriga xabar yuborildi.` })}
                     >
                        <div>
                          <p className="text-sm font-medium text-white">{opp.name}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="text-emerald-400 font-mono">{opp.val}</span>
                            <span className="text-white/40">Win Prob: {opp.prob}%</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          opp.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                          opp.risk === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {opp.risk} Risk
                        </div>
                     </div>
                   ))}
                 </div>
               </Card>

               <Card className="glass-card border-white/10 p-6 flex flex-col">
                 <div className="flex items-center gap-2 mb-6">
                   <Users className="size-5 text-purple-400" />
                   <h3 className="text-lg font-semibold text-white">HR & Productivity</h3>
                 </div>
                 <div className="space-y-4 flex-1">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-white/70">Engineering Dept Health</span>
                     <span className="text-sm font-mono text-emerald-400">94/100</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[94%]" />
                   </div>
                   
                   <div className="flex items-center justify-between mt-4">
                     <span className="text-sm text-white/70">Sales Dept Health</span>
                     <span className="text-sm font-mono text-amber-400">76/100</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-[76%]" />
                   </div>

                   <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer" onClick={() => toast({ title: "HR Action Taken", description: "Savdo jamoasi rahbari bilan yig'ilish belgilandi.", type: "success" })}>
                     <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">AI Recommendation</p>
                     <p className="text-sm text-purple-200/70">Sales team showing signs of quota fatigue. Consider adjusting Q4 targets to maintain morale.</p>
                   </div>
                 </div>
               </Card>
            </div>
         </div>

         {/* Side Analysis */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="glass-card border-red-500/20 bg-red-900/10 h-full max-h-[400px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <ShieldAlert className="size-5 text-red-400" /> Strategic Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                 {insights.filter(i => i.type === 'Risk' || i.type === 'Alert').map(insight => (
                   <div 
                     key={insight.id} 
                     className="p-3 border-l-2 border-red-500 bg-black/40 shadow-sm hover:bg-black/60 cursor-pointer transition-colors"
                     onClick={() => handleAlertDismiss(insight.id)}
                   >
                     <p className="text-sm font-medium text-white mb-1">{insight.title}</p>
                     <p className="text-xs text-white/60">{insight.description}</p>
                   </div>
                 ))}
                 {insights.filter(i => i.type === 'Risk' || i.type === 'Alert').length === 0 && (
                   <p className="text-sm text-white/40 italic px-2">No active strategic risks detected by AI.</p>
                 )}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <DollarSign className="size-5 text-sky-400" /> Revenue Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="h-24 w-1/5 bg-white/10 rounded-t-sm hover:bg-white/20 transition-colors relative group cursor-pointer" onClick={() => toast({ title: "Q1 Results", description: "Q1 Revenue: $850k" })}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white">Q1</div>
                    </div>
                    <div className="h-32 w-1/5 bg-white/10 rounded-t-sm hover:bg-white/20 transition-colors relative group cursor-pointer" onClick={() => toast({ title: "Q2 Results", description: "Q2 Revenue: $1.1M" })}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white">Q2</div>
                    </div>
                    <div className="h-20 w-1/5 bg-white/10 rounded-t-sm hover:bg-white/20 transition-colors relative group cursor-pointer" onClick={() => toast({ title: "Q3 Results", description: "Q3 Revenue: $750k (Dip due to seasonality)" })}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white">Q3</div>
                    </div>
                    <div className="h-40 w-1/5 bg-sky-500/50 rounded-t-sm hover:bg-sky-500/60 transition-colors relative group border-t-2 border-sky-400 cursor-pointer" onClick={() => toast({ title: "Q4 Projection", description: "Q4 Projected: $1.5M" })}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-sky-300">Q4 (Proj)</div>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 text-center border-t border-white/10 pt-3">
                    Business Analyst AI projects record Q4 revenue based on current pipeline momentum.
                  </p>
                </div>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
