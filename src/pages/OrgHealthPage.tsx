import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Activity, ShieldCheck, HeartPulse, Target, TrendingUp, History, RefreshCcw, Handshake } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function OrgHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <HeartPulse className="size-8 text-emerald-400" /> Organizational Health Index
          </h1>
          <p className="text-white/60 mt-1 text-sm">Composite scoring of productivity, customer success, employee health, and efficiency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-emerald-900/20 to-transparent">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Global Health Score</span>
           <div className="relative size-32 rounded-full border-[8px] border-emerald-500/20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="351" strokeDashoffset="42" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"></circle>
              </svg>
              <div className="flex flex-col items-center">
                 <span className="text-4xl font-bold text-white">88</span>
                 <span className="text-[10px] text-emerald-400">+2 from last month</span>
              </div>
           </div>
         </Card>

         <Card className="glass-card border-white/10 p-6 lg:col-span-2">
            <CardTitle className="text-sm text-white/70 uppercase tracking-widest font-semibold mb-6 flex items-center gap-2">
              <Target className="size-4" /> Component Breakdown
            </CardTitle>
            <div className="space-y-5">
               {[
                 { label: 'Operational Efficiency', score: 92, color: 'bg-emerald-500', icon: Activity },
                 { label: 'Customer Success', score: 85, color: 'bg-sky-500', icon: Handshake },
                 { label: 'Employee Well-being', score: 76, color: 'bg-amber-500', icon: HeartPulse },
                 { label: 'Revenue & Growth', score: 96, color: 'bg-purple-500', icon: TrendingUp },
               ].map((comp, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <div className={`p-2 rounded-lg bg-white/5`}>
                        <comp.icon className={`size-4 text-white/70`} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-white/90">{comp.label}</span>
                          <span className="text-sm font-mono text-white/60">{comp.score}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${comp.color}`} style={{ width: `${comp.score}%` }}></div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      <Card className="glass-card border-white/10">
         <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <RefreshCcw className="size-5 text-sky-400" /> Continuous Improvement Engine
            </CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-sm text-white/60 mb-6">Tracking the long-term impact of applied autonomous optimizations.</p>
            
            <div className="space-y-4">
               {[
                 { name: 'Redundant Approval Merge (Finance)', applied: '2 weeks ago', before: '4.2 days/inv', after: '1.4 days/inv', impact: 'High (+66% faster)' },
                 { name: 'AI Lead Routing Policy', applied: '1 month ago', before: '22% drop-off', after: '5% drop-off', impact: 'Critical (+17% coverage)' },
                 { name: 'Tier 2 Support Load Balancing', applied: '2 months ago', before: '14h wait time', after: '6h wait time', impact: 'Medium (+57% faster)' },
               ].map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-black/40 border border-white/5 rounded-xl items-center">
                     <div className="md:col-span-1">
                        <h4 className="font-semibold text-sm text-white/90">{item.name}</h4>
                        <span className="text-[10px] text-white/40">Applied: {item.applied}</span>
                     </div>
                     <div className="md:col-span-1 text-center bg-white/5 p-2 rounded">
                        <p className="text-[10px] text-white/40 uppercase mb-1">Before Optimization</p>
                        <p className="text-sm font-mono text-red-300">{item.before}</p>
                     </div>
                     <div className="md:col-span-1 text-center bg-white/5 p-2 rounded border border-emerald-500/20">
                        <p className="text-[10px] text-white/40 uppercase mb-1">Current State</p>
                        <p className="text-sm font-mono text-emerald-400">{item.after}</p>
                     </div>
                     <div className="md:col-span-1 text-right">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{item.impact}</Badge>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
