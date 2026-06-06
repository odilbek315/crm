import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { BarChart3, TrendingDown, Layers, ArrowUpRight, Network } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <BarChart3 className="size-8 text-amber-400" /> Advanced Analytics & BI
          </h1>
          <p className="text-white/60 mt-1 text-sm">Enterprise Data Warehouse and custom dashboarding layer.</p>
        </div>
        <Button className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30">
          Create Custom Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Total Event Volume</span>
           <div className="flex items-end gap-3 mt-2">
             <p className="text-3xl font-display font-bold text-white tracking-tight">14.2M</p>
             <span className="text-emerald-400 text-sm mb-1 flex items-center"><ArrowUpRight className="size-4" /> 12%</span>
           </div>
         </Card>
         
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Storage Processed</span>
           <div className="flex items-end gap-3 mt-2">
             <p className="text-3xl font-display font-bold text-white tracking-tight">8.4 TB</p>
           </div>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Active Dashboards</span>
           <div className="flex items-end gap-3 mt-2">
             <p className="text-3xl font-display font-bold text-white tracking-tight">24</p>
           </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10 h-96 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-white">Cross-Module Correlation Matrix</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 relative">
             <Network className="absolute inset-0 m-auto size-32 text-amber-500/10" />
             <p className="text-white/40 text-sm relative z-10">Select metrics to run multi-dimensional analysis.</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 h-96 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-white">Data Warehouse Sync Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
             {[
               { module: 'CRM Core', records: '2.4M', status: 'synced', time: 'Just now' },
               { module: 'Audit Logs', records: '11.8M', status: 'syncing', time: 'Syncing...' },
               { module: 'ERP Finance', records: '840k', status: 'synced', time: '5 mins ago' },
               { module: 'HR System', records: '12k', status: 'synced', time: '1 hour ago' },
               { module: 'Custom Entities', records: '45k', status: 'synced', time: '2 hours ago' },
             ].map((sync, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
                   <div className="flex items-center gap-3">
                     <Layers className="size-4 text-white/50" />
                     <div>
                       <p className="text-sm font-medium text-white/90">{sync.module}</p>
                       <p className="text-[10px] text-white/40">Last sync: {sync.time}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-mono text-sm text-white/70">{sync.records}</p>
                     {sync.status === 'syncing' ? (
                       <span className="text-[10px] text-amber-400 font-medium">Syncing...</span>
                     ) : (
                       <span className="text-[10px] text-emerald-400 font-medium">Verified</span>
                     )}
                   </div>
                </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
