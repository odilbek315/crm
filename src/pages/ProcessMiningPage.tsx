import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Search, Hourglass, TrendingDown, Sparkles, Workflow, Zap, Settings2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/Toast';

export function ProcessMiningPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState([
    { id: '1', title: 'Merge Redundant Approvals', desc: 'Finance and Legal are approving identical invoice data sequentially. Merging into a parallel step saves 1.8 days on average per invoice.', impact: 'High', type: 'Workflow Edit' },
    { id: '2', title: 'Reassign Manual Routing', desc: '22% of leads fall out of automated assignment logic and wait 4.2 days. Suggesting new AI routing rule to handle edge cases.', impact: 'Critical', type: 'Logic Update' },
    { id: '3', title: 'Department Load Balancing', desc: 'Support Tier 2 is overloaded causing a 14h backlog. Support Tier 1 has 40% idle time. Suggesting capability matrix adjustment.', impact: 'Medium', type: 'Resource' },
  ]);
  
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleApply = (id: string, title: string) => {
    setApplyingId(id);
    setTimeout(() => {
      setProposals(prev => prev.filter(p => p.id !== id));
      setApplyingId(null);
      toast({
        title: "Optimallashtirish qo'llanildi",
        description: `"${title}" muvaffaqiyatli tatbiq etildi va ish jarayoniga kiritildi.`,
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Search className="size-8 text-fuchsia-400" /> Process Mining Engine
          </h1>
          <p className="text-white/60 mt-1 text-sm">Automated discovery of workflow inefficiencies, bottlenecks, and optimization opportunities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-red-500">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2"><Hourglass className="size-4" /> Detected Bottlenecks</span>
            <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">{proposals.length + 11} <span className="text-sm font-normal text-white/40">Active</span></p>
         </Card>
         
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-amber-500">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2"><TrendingDown className="size-4" /> Process Delays</span>
            <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">Avg 2.4<span className="text-xl">d</span> <span className="text-sm font-normal text-amber-400">Above baseline</span></p>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-fuchsia-500">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2"><Sparkles className="size-4" /> Optimization Proposals</span>
            <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">{proposals.length} <span className="text-sm font-normal text-emerald-400">Ready to Review</span></p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="glass-card border-white/10 h-[500px] flex flex-col">
            <CardHeader className="pb-3 border-b border-white/5">
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Workflow className="size-5 text-white/60" /> Discovered Process Map
               </CardTitle>
               <CardDescription className="text-white/50">Derived from 6,420 execution traces across the CRM and ERP modules.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 relative flex items-center justify-center p-0 overflow-hidden bg-[#0a0a0f]">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               
               <div className="relative w-full h-full p-8 flex flex-col items-center justify-center space-y-6">
                 <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">Lead Created (100%)</Badge>
                 <div className="w-0.5 h-8 bg-white/20 relative"><div className="absolute -bottom-2 -left-1.5 border-[6px] border-transparent border-t-white/20"></div></div>
                 
                 <div className="flex gap-16 justify-center w-full">
                    <div className="flex flex-col items-center">
                       <Badge className="bg-white/10 text-white/70 border-white/20 px-3 py-1 text-center whitespace-normal max-w-[120px]">Auto-Assigned (78%)</Badge>
                       <div className="w-0.5 h-16 bg-white/20 relative flex items-center justify-center"><div className="absolute border-[6px] border-transparent border-t-white/20 -bottom-2 -left-1.5"></div><span className="absolute bg-black px-1 text-[10px] text-white/40 left-2">2h</span></div>
                    </div>
                    <div className="flex flex-col items-center">
                       <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-3 py-1 text-center whitespace-normal max-w-[120px]">Manual Routing (22%)</Badge>
                       <div className="w-0.5 h-16 bg-red-500/50 relative flex items-center justify-center"><div className="absolute border-[6px] border-transparent border-t-red-500/50 -bottom-2 -left-1.5"></div><span className="absolute bg-black px-1 text-[10px] text-red-400 left-2 font-bold">4.2d delay</span></div>
                    </div>
                 </div>

                 <Badge className="bg-white/10 text-white/70 border-white/20 px-3 py-1">Contact Attempted</Badge>
               </div>
            </CardContent>
         </Card>

         <Card className="glass-card border-white/10 bg-gradient-to-b from-[#0f0b15] to-black h-full flex flex-col">
            <CardHeader>
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Zap className="size-5 text-fuchsia-400" /> Autonomous Optimization Engine
               </CardTitle>
               <CardDescription className="text-white/60">Generated proposals to automatically resolve identified bottlenecks.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
               {proposals.length === 0 ? (
                 <div className="h-64 flex flex-col items-center justify-center text-white/40 text-sm gap-2">
                   <Zap className="size-8 text-fuchsia-400/50 animate-pulse" />
                   Barcha optimallashtirishlar muvaffaqiyatli qo'llanildi.
                 </div>
               ) : (
                 proposals.map((prop) => (
                   <div key={prop.id} className="p-4 bg-black/40 border border-white/10 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-colors">
                      <div className="absolute top-0 right-0 p-3">
                        <Badge className={`text-[10px] uppercase border-transparent ${prop.impact === 'Critical' ? 'bg-red-500/20 text-red-400' : prop.impact === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/50'}`}>
                           Impact: {prop.impact}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2 pr-20">
                        <Settings2 className="size-4 text-fuchsia-400" /> <h4 className="font-semibold text-white/90">{prop.title}</h4>
                      </div>
                      <p className="text-xs text-white/60 mb-4">{prop.desc}</p>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">{prop.type}</span>
                         <Button
                           size="sm"
                           onClick={() => handleApply(prop.id, prop.title)}
                           disabled={applyingId !== null}
                           className="bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 border border-fuchsia-500/30 h-7 text-xs flex items-center gap-1.5"
                         >
                           {applyingId === prop.id && <Loader2 className="size-3 animate-spin" />}
                           Apply Resolution
                         </Button>
                      </div>
                   </div>
                 ))
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
