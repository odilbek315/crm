import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Network, Activity, Filter, ZoomIn, ZoomOut, Maximize, User, Building, Briefcase, FileText, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function BusinessGraphPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Network className="size-8 text-indigo-400" /> Business Graph Engine
          </h1>
          <p className="text-white/60 mt-1 text-sm">Interactive visualization of enterprise relationships and operational dependencies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white/70 hover:text-white bg-transparent">
            <Filter className="size-4 mr-2" /> Filter Entities
          </Button>
          <Button className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
            Run Path Analysis
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[500px] grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Sidebar Controls */}
         <div className="lg:col-span-1 space-y-4 flex flex-col">
            <Card className="glass-card border-white/10 flex-shrink-0">
               <CardHeader className="pb-3">
                 <CardTitle className="text-sm text-white">Entity Toggles</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  {[
                    { label: 'Customers', icon: Building, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                    { label: 'Leads', icon: User, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Deals & Sales', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Invoices', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Products', icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  ].map((entity, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded border border-white/5 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-2">
                         <div className={`p-1.5 rounded ${entity.bg}`}>
                           <entity.icon className={`size-3.5 ${entity.color}`} />
                         </div>
                         <span className="text-sm font-medium text-white/80">{entity.label}</span>
                       </div>
                       <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                         <div className="size-3 bg-white rounded-full absolute right-0.5 top-0.5" />
                       </div>
                    </div>
                  ))}
               </CardContent>
            </Card>

            <Card className="glass-card border-white/10 flex-1 overflow-y-auto custom-scrollbar">
               <CardHeader className="pb-3 top-0 sticky bg-black/40 backdrop-blur-md z-10 border-b border-white/5">
                 <CardTitle className="text-sm text-white">Critical Dependencies</CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div className="p-3 border-l-2 border-red-500 bg-red-500/5 rounded-r">
                    <p className="text-xs font-semibold text-red-400 mb-1">High-Risk Dependency Chain</p>
                    <p className="text-[10px] text-white/60">Supplier A → Product X → Key Customer B (Accounts for 15% ARR). Supplier A showing payment delays.</p>
                  </div>
                  <div className="p-3 border-l-2 border-amber-500 bg-amber-500/5 rounded-r">
                    <p className="text-xs font-semibold text-amber-400 mb-1">Process Bottleneck</p>
                    <p className="text-[10px] text-white/60">Legal Dept is currently a blocker for 12 Enterprise Deals awaiting contract approval.</p>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Graph Canvas area */}
         <Card className="lg:col-span-3 glass-card border-white/10 relative overflow-hidden flex flex-col bg-[#050510]">
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 backdrop-blur-md">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white"><ZoomIn className="size-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white"><ZoomOut className="size-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white"><Maximize className="size-4" /></Button>
            </div>
            
            <div className="flex-1 w-full h-full flex items-center justify-center relative">
               {/* Decorative background grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               
               {/* Simulated Nodes Structure */}
               <div className="relative w-[600px] h-[400px]">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-indigo-500/20 border-2 border-indigo-500 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.2)] z-20 flex flex-col items-center">
                    <Briefcase className="size-6 text-indigo-400 mb-1" />
                    <span className="text-sm font-bold text-white whitespace-nowrap">Acme Corp (Global)</span>
                    <Badge className="mt-1 bg-white/10 text-white/60 text-[10px] h-4">Enterprise</Badge>
                  </div>

                  {/* Connected Nodes */}
                  <div className="absolute top-[10%] left-[20%] p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-sky-500/20 transition-all">
                    <User className="size-4 text-sky-400 mb-1" />
                    <span className="text-xs font-medium text-white">John Doe (Champion)</span>
                  </div>

                  <div className="absolute bottom-[20%] left-[10%] p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-amber-500/20 transition-all">
                    <Briefcase className="size-4 text-amber-400 mb-1" />
                    <span className="text-xs font-medium text-white">Project Phoenix Deal</span>
                  </div>

                  <div className="absolute top-[30%] right-[10%] p-3 bg-red-500/10 border border-red-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-red-500/20 transition-all">
                    <FileText className="size-4 text-red-400 mb-1" />
                    <span className="text-xs font-medium text-white">INV-9092 (Overdue)</span>
                  </div>

                  <div className="absolute bottom-[10%] right-[25%] p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-purple-500/20 transition-all">
                    <Building className="size-4 text-purple-400 mb-1" />
                    <span className="text-xs font-medium text-white">Acme EU Subsidiary</span>
                  </div>

                  {/* SVG Lines */}
                  <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                     <path d="M 170 80 Q 250 150 300 200" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                     <path d="M 120 320 Q 200 250 300 200" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                     <path d="M 470 150 Q 400 180 300 200" fill="transparent" stroke="rgba(255,0,0,0.4)" strokeWidth="2" />
                     <path d="M 420 360 Q 380 280 300 200" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  </svg>
               </div>
            </div>
            
            <div className="absolute bottom-4 left-4 z-10 flex gap-4 p-2 bg-black/40 rounded-lg border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-white/20"></div><span className="text-[10px] text-white/50">Standard Rel</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-red-500/50"></div><span className="text-[10px] text-white/50">Risk/Blocker</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-white/20 border-t border-dashed"></div><span className="text-[10px] text-white/50">Implicit Rel</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
