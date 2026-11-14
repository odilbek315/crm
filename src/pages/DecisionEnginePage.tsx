import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Play, Settings2, BarChart2, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export function DecisionEnginePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Lightbulb className="size-8 text-amber-400" /> Decision Engine & Simulation
          </h1>
          <p className="text-white/60 mt-1 text-sm">Predictive analytics, scenario planning, and autonomous business recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Top Recommendations */}
         <Card className="glass-card border-white/10">
            <CardHeader>
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Zap className="size-5 text-amber-400" /> High-Priority Recommendations
               </CardTitle>
               <CardDescription className="text-white/60">Sourced from real-time operational data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-red-400 flex items-center gap-2"><AlertTriangle className="size-4" /> High Churn Risk Detected</h4>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Action Required</Badge>
                  </div>
                  <p className="text-xs text-white/70 mb-3">3 Enterprise accounts in EU region mapping to $1.2M ARR exhibit sharp drops in platform activity over the last 14 days.</p>
                  <Button size="sm" className="bg-red-500/20 text-red-300 hover:bg-red-500/30 h-7 text-xs border border-red-500/30">Schedule Executive Review</Button>
               </div>

               <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-amber-400 flex items-center gap-2"><TrendingDown className="size-4" /> Impending Inventory Shortage</h4>
                  </div>
                  <p className="text-xs text-white/70 mb-3">Model predicts SKU-8992 will stock out in 12 days due to an unusual spike in Q3 Pipeline probability.</p>
                  <Button size="sm" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 h-7 text-xs border border-amber-500/30">Auto-Generate Purchase Order</Button>
               </div>

               <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-emerald-400 flex items-center gap-2"><TrendingUp className="size-4" /> Upsell Opportunity</h4>
                  </div>
                  <p className="text-xs text-white/70 mb-3">15 mid-market customers are nearing their API limits. Historical conversion for this cohort is 42%.</p>
                  <Button size="sm" className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 h-7 text-xs border border-emerald-500/30">Deploy Marketing Campaign</Button>
               </div>
            </CardContent>
         </Card>

         {/* Predictive Forecasts */}
         <div className="space-y-6">
            <Card className="glass-card border-white/10">
               <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <BarChart2 className="size-5 text-sky-400" /> Predictive Forecasts (Q3)
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                     <span className="text-xs text-white/40 uppercase font-semibold mb-1">Expected Revenue</span>
                     <p className="text-2xl font-bold text-white">$4.2M <span className="text-sm font-normal text-emerald-400 ml-1">± 3%</span></p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                     <span className="text-xs text-white/40 uppercase font-semibold mb-1">Predicted Churn</span>
                     <p className="text-2xl font-bold text-white">2.1% <span className="text-sm font-normal text-red-400 ml-1">± 0.5%</span></p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                     <span className="text-xs text-white/40 uppercase font-semibold mb-1">Cash Flow Margin</span>
                     <p className="text-2xl font-bold text-white">28.4% <span className="text-sm font-normal text-emerald-400 ml-1">Strong</span></p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                     <span className="text-xs text-white/40 uppercase font-semibold mb-1">Employee Attrition</span>
                     <p className="text-2xl font-bold text-white">4.5% <span className="text-sm font-normal text-amber-400 ml-1">Elevated</span></p>
                  </div>
               </CardContent>
            </Card>

            <Card className="glass-card border-white/10 bg-gradient-to-br from-[#0b0c10] to-[#1f2833]">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg text-white flex items-center gap-2">
                   <Settings2 className="size-5 text-purple-400" /> Scenario Planner
                 </CardTitle>
                 <CardDescription className="text-white/60">Simulate business outcomes by tweaking variables.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">If Sales Pipeline Conversion Increases By:</label>
                    <div className="flex gap-2">
                      <Input type="number" defaultValue="15" className="bg-black/40 border-white/10 text-white w-24 text-right" />
                      <div className="flex items-center text-white/40">%</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">And Global Supplier Costs Rise By:</label>
                    <div className="flex gap-2">
                      <Input type="number" defaultValue="5" className="bg-black/40 border-white/10 text-white w-24 text-right" />
                      <div className="flex items-center text-white/40">%</div>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 mt-2">
                    <Play className="size-4 mr-2" /> Run Monte Carlo Simulation
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
