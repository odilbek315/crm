import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Globe, Building, Users, Server, Database, Boxes, Layers, RefreshCcw, Activity } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function DigitalTwinPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Globe className="size-8 text-cyan-400" /> Organization Digital Twin
          </h1>
          <p className="text-white/60 mt-1 text-sm">Dynamic digital representation of the company's departments, processes, and resources for simulation.</p>
        </div>
        <Button className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30">
          <RefreshCcw className="size-4 mr-2" /> Sync Live State
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
         {/* Twin Explorer Tree */}
         <Card className="lg:col-span-1 glass-card border-white/10 flex flex-col shrink-0">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm text-white">Entity Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-0">
              <div className="p-4 space-y-1">
                 <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer text-white/90">
                   <Building className="size-4 text-white/40" /> <span className="text-sm font-medium">Headquarters</span>
                 </div>
                 <div className="pl-4 space-y-1">
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer text-white/80">
                      <div className="flex items-center gap-2"><Users className="size-4 text-cyan-400" /><span className="text-sm">Sales & Marketing</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">42</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer text-white/80 bg-white/5">
                      <div className="flex items-center gap-2"><Server className="size-4 text-purple-400" /><span className="text-sm">Engineering</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">120</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer text-white/80">
                      <div className="flex items-center gap-2"><Boxes className="size-4 text-amber-400" /><span className="text-sm">Logistics</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">18</Badge>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer text-white/90 mt-2">
                   <Building className="size-4 text-white/40" /> <span className="text-sm font-medium">EU Hub</span>
                 </div>
                 <div className="pl-4 space-y-1">
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer text-white/80">
                      <div className="flex items-center gap-2"><Users className="size-4 text-cyan-400" /><span className="text-sm">Customer Success</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">24</Badge>
                    </div>
                 </div>
              </div>
            </CardContent>
         </Card>

         {/* Twin Dashboard */}
         <div className="lg:col-span-3 space-y-6">
            <Card className="glass-card border-white/10 bg-[#06080d]">
               <CardHeader>
                 <CardTitle className="text-lg text-white flex items-center gap-2">
                   <Activity className="size-5 text-cyan-400" /> Engineering Department Sub-Twin
                 </CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/50 uppercase font-semibold mb-1">Resource Load</p>
                    <p className="text-2xl font-bold text-white tracking-tight">84%</p>
                    <p className="text-[10px] text-amber-400 mt-1">Warning: Approaching Capacity</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/50 uppercase font-semibold mb-1">Process Efficiency</p>
                    <p className="text-2xl font-bold text-white tracking-tight">92<span className="text-sm text-white/40">/100</span></p>
                    <p className="text-[10px] text-emerald-400 mt-1">Healthy</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/50 uppercase font-semibold mb-1">Cost Burn Rate</p>
                    <p className="text-2xl font-bold text-white tracking-tight">$420k<span className="text-sm text-white/40">/mo</span></p>
                    <p className="text-[10px] text-white/40 mt-1">Steady</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="glass-card border-white/10 h-[300px] flex flex-col">
               <CardHeader className="pb-3">
                 <CardTitle className="text-lg text-white flex items-center gap-2">
                   <Layers className="size-5 text-purple-400" /> Simulation Sandbox
                 </CardTitle>
               </CardHeader>
               <CardContent className="flex-1 border-t border-white/5 flex items-center justify-center p-6 relative">
                  <div className="max-w-md w-full space-y-4">
                     <p className="text-sm text-white/60 text-center mb-6">Modify the digital twin constraints to simulate operational impact before applying changes to the real organization.</p>
                     
                     <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-sm text-white/90">Add +10 FTEs to Engineering</span>
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded border border-emerald-500/30 text-center">
                           Reduces delivery time by 14%<br/><span className="text-[10px] opacity-70">Burn rate +$120k/mo</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-sm text-white/90">Mandate RTO (Remove Remote)</span>
                        <div className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30 text-center">
                           Attrition risk increases by 18%<br/><span className="text-[10px] opacity-70">Cost +$40k/mo (Facilities)</span>
                        </div>
                     </div>
                     
                     <Button className="w-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30">
                       Create Custom Simulation Rule
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
