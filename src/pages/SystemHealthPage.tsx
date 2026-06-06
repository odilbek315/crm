import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { HeartPulse, Database, Server, Webhook, Activity, Users, FileText } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Platform Monitoring</h1>
          <p className="text-emerald-400 mt-1 text-sm font-mono">System Status: All Services Operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <div className="flex items-center gap-2 text-white/50 mb-1">
             <Database className="size-4" /> <span className="text-xs uppercase tracking-wider">PostgreSQL Target</span>
           </div>
           <p className="text-2xl font-mono text-white">4.2ms</p>
           <p className="text-[10px] text-emerald-400">Avg Latency</p>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <div className="flex items-center gap-2 text-white/50 mb-1">
             <Webhook className="size-4" /> <span className="text-xs uppercase tracking-wider">Event Bus</span>
           </div>
           <p className="text-2xl font-mono text-white">124k/hr</p>
           <p className="text-[10px] text-emerald-400">Throughput</p>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <div className="flex items-center gap-2 text-white/50 mb-1">
             <Server className="size-4" /> <span className="text-xs uppercase tracking-wider">Memory Cache</span>
           </div>
           <p className="text-2xl font-mono text-white">45%</p>
           <p className="text-[10px] text-white/40">Utilization (Virtual Tables)</p>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-2">
           <div className="flex items-center gap-2 text-white/50 mb-1">
             <HeartPulse className="size-4" /> <span className="text-xs uppercase tracking-wider">Agent Health</span>
           </div>
           <p className="text-2xl font-mono text-white">100%</p>
           <p className="text-[10px] text-emerald-400">Uptime</p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Service Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[
               { name: 'Core API Gateway', status: 'Healthy', load: '12%' },
               { name: 'Identity & Access (RBAC)', status: 'Healthy', load: '4%' },
               { name: 'Multi-Tenant Router', status: 'Healthy', load: '18%' },
               { name: 'Notification Engine', status: 'Healthy', load: '8%' },
               { name: 'Workflow Simulator', status: 'Healthy', load: '22%' },
             ].map((svc, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                 <span className="text-sm font-medium text-white/80">{svc.name}</span>
                 <div className="flex items-center gap-4">
                   <span className="text-xs font-mono text-white/40">Load: {svc.load}</span>
                   <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase">{svc.status}</Badge>
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Real-Time Event Stream</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3 font-mono text-[10px] text-white/60">
               {[
                 '[14:02:44.112] [AUTH] Tenant resolution successful for domain: acme.local',
                 '[14:02:44.890] [EVENT] LeadCreated event published by user: u-8291',
                 '[14:02:44.901] [NOTIFY] Enqueued SMS Notification to 1 subscriber',
                 '[14:02:45.320] [AI] SalesManager agent analyzing LeadCreated event',
                 '[14:02:47.100] [CACHE] Virtual table pre-warmed for Customer list view',
                 '[14:02:48.005] [EVENT] DealStageUpdated: Negotiating -> Won',
                 '[14:02:48.015] [AI] CEOAssistant anomaly detection triggered (positive)',
               ].map((log, i) => (
                 <div key={i} className="pb-1 border-b border-white/5 last:border-0 truncate">
                   {log}
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
