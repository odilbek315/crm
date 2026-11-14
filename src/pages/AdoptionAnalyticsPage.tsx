import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { PieChart, Zap, Hand, Pointer, Ban, Rocket, Lightbulb, Box } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function AdoptionAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <PieChart className="size-8 text-orange-400" /> Adoption & Usage Analytics
          </h1>
          <p className="text-white/60 mt-1 text-sm">Monitor feature usage, discover abandoned workflows, and receive optimization recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2"><Pointer className="size-4" /> Daily Active Users (DAU)</span>
           <p className="text-3xl font-display font-bold text-white tracking-tight">8,420</p>
           <span className="text-xs text-emerald-400">+12% vs last month</span>
         </Card>
         
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2"><Box className="size-4" /> Actively Used Modules</span>
           <p className="text-3xl font-display font-bold text-white tracking-tight">14<span className="text-sm font-normal text-white/40">/18</span></p>
           <span className="text-xs text-white/50">Core platform</span>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2"><Ban className="size-4" /> Abandoned Workflows</span>
           <p className="text-3xl font-display font-bold text-red-400 tracking-tight">12</p>
           <span className="text-xs text-white/50">Wasting system resources</span>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="glass-card border-white/10">
            <CardHeader>
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Rocket className="size-5 text-sky-400" /> Module Engagement Heatmap
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[
                    { name: 'CRM (Leads & Sales)', usage: 98, trend: 'stable' },
                    { name: 'Finance & Invoicing', usage: 85, trend: 'up' },
                    { name: 'HR & Directory', usage: 72, trend: 'stable' },
                    { name: 'Knowledge Center', usage: 45, trend: 'down' },
                    { name: 'App Marketplace', usage: 22, trend: 'up' },
                    { name: 'BI Analytics', usage: 15, trend: 'down' },
                  ].map((mod, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <div className="flex justify-between text-sm">
                         <span className="text-white/80">{mod.name}</span>
                         <span className="font-mono text-white/60">{mod.usage}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${mod.usage > 80 ? 'bg-emerald-500' : mod.usage > 40 ? 'bg-sky-500' : 'bg-red-500'}`} style={{ width: `${mod.usage}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="glass-card border-white/10 bg-gradient-to-br from-amber-950/20 to-black">
            <CardHeader>
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Lightbulb className="size-5 text-amber-400" /> Process Recommendation Center
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 bg-black/40 border border-amber-500/20 rounded-xl relative overflow-hidden">
                  <h4 className="font-semibold text-amber-400 mb-1">Underutilized Feature: BI Analytics</h4>
                  <p className="text-xs text-white/60 mb-3">Only 15% of managers are accessing custom dashboards. AI suggests auto-emailing weekly PDF summaries to boost engagement.</p>
                  <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent border-amber-500/30 text-amber-300 hover:bg-amber-500/10">Configure Auto-Reports</Button>
               </div>

               <div className="p-4 bg-black/40 border border-white/5 rounded-xl relative overflow-hidden">
                  <h4 className="font-semibold text-white/90 mb-1">Obsolete Workflow Detected</h4>
                  <p className="text-xs text-white/60 mb-3">The "Expense Pre-Approval" workflow hasn't been triggered in 90 days since the new policy rollout. Suggest disabling.</p>
                  <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white">Archive Workflow</Button>
               </div>
               
               <div className="p-4 bg-black/40 border border-white/5 rounded-xl relative overflow-hidden">
                  <h4 className="font-semibold text-white/90 mb-1">Automation Opportunity</h4>
                  <p className="text-xs text-white/60 mb-3">HR is manually uploading 40+ onboarding documents daily. Recommend enabling the "Google Drive Sync" plugin.</p>
                  <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white">View Plugin Setup</Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
