import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Globe, Building, Users, Server, Boxes, Layers, RefreshCcw, Activity, Loader2, Plus, Check } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/Toast';
import { Input } from '../components/ui/input';

interface Rule {
  id: string;
  name: string;
  effect: string;
  details: string;
  active: boolean;
  type: 'positive' | 'negative';
}

export function DigitalTwinPage() {
  const { toast } = useToast();
  const [selectedDept, setSelectedDept] = useState<'Engineering' | 'Sales & Marketing' | 'Logistics' | 'Customer Success'>('Engineering');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleEffect, setNewRuleEffect] = useState('');
  const [newRuleDetails, setNewRuleDetails] = useState('');

  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: 'Add +10 FTEs to Engineering', effect: 'Reduces delivery time by 14%', details: 'Burn rate +$120k/mo', active: false, type: 'positive' },
    { id: '2', name: 'Mandate RTO (Remove Remote)', effect: 'Attrition risk increases by 18%', details: 'Cost +$40k/mo (Facilities)', active: false, type: 'negative' }
  ]);

  // Dynamic department stats
  const baseDeptStats = {
    'Engineering': { load: 84, efficiency: 92, burn: 420 },
    'Sales & Marketing': { load: 72, efficiency: 88, burn: 280 },
    'Logistics': { load: 60, efficiency: 95, burn: 150 },
    'Customer Success': { load: 78, efficiency: 90, burn: 190 }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Tizim holati sinxronlandi",
        description: `Raqamli egizak (Digital Twin) ${selectedDept} bo'limining so'nggi ma'lumotlari bilan sinxronlashtirildi.`,
        type: "success"
      });
    }, 1500);
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast({
        title: rule.active ? "Simulyatsiya qoidasi olib tashlandi" : "Simulyatsiya qoidasi yoqildi",
        description: `"${rule.name}" o'zgarishi simulyatsiya natijalariga ta'sir qilmoqda.`,
        type: rule.active ? "info" : "warning"
      });
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRuleEffect) return;

    const newRule: Rule = {
      id: Math.random().toString(36).substring(2, 9),
      name: newRuleName,
      effect: newRuleEffect,
      details: newRuleDetails,
      active: true,
      type: newRuleDetails.toLowerCase().includes('cost') || newRuleDetails.toLowerCase().includes('burn') ? 'negative' : 'positive'
    };

    setRules(prev => [...prev, newRule]);
    setNewRuleName('');
    setNewRuleEffect('');
    setNewRuleDetails('');
    setIsModalOpen(false);
    
    toast({
      title: "Yangi simulyatsiya qoidasi yaratildi",
      description: `"${newRule.name}" faol holatda simulyatsiyaga qo'shildi.`,
      type: "success"
    });
  };

  // Compute stats based on active rules
  const activePositiveCount = rules.filter(r => r.active && r.type === 'positive').length;
  const activeNegativeCount = rules.filter(r => r.active && r.type === 'negative').length;

  const getStats = () => {
    const base = baseDeptStats[selectedDept];
    let load = base.load + (activeNegativeCount * 8) - (activePositiveCount * 5);
    let efficiency = base.efficiency + (activePositiveCount * 4) - (activeNegativeCount * 6);
    let burn = base.burn + (activePositiveCount * 120) + (activeNegativeCount * 40);

    return {
      load: Math.min(100, Math.max(0, load)),
      efficiency: Math.min(100, Math.max(0, efficiency)),
      burn
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Globe className="size-8 text-cyan-400" /> Organization Digital Twin
          </h1>
          <p className="text-white/60 mt-1 text-sm">Dynamic digital representation of the company's departments, processes, and resources for simulation.</p>
        </div>
        <Button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 flex items-center gap-2"
        >
          {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
          Sync Live State
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
                 <div className="flex items-center gap-2 p-2 text-white/40 select-none">
                   <Building className="size-4" /> <span className="text-sm font-medium">Headquarters</span>
                 </div>
                 <div className="pl-4 space-y-1">
                    <div 
                      onClick={() => setSelectedDept('Sales & Marketing')}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedDept === 'Sales & Marketing' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2"><Users className="size-4 text-cyan-400" /><span className="text-sm">Sales & Marketing</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">42</Badge>
                    </div>
                    <div 
                      onClick={() => setSelectedDept('Engineering')}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedDept === 'Engineering' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2"><Server className="size-4 text-purple-400" /><span className="text-sm">Engineering</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">120</Badge>
                    </div>
                    <div 
                      onClick={() => setSelectedDept('Logistics')}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedDept === 'Logistics' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2"><Boxes className="size-4 text-amber-400" /><span className="text-sm">Logistics</span></div>
                      <Badge className="bg-white/10 text-[10px] px-1.5 py-0 border-transparent">18</Badge>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 p-2 text-white/40 select-none mt-2">
                   <Building className="size-4" /> <span className="text-sm font-medium">EU Hub</span>
                 </div>
                 <div className="pl-4 space-y-1">
                    <div 
                      onClick={() => setSelectedDept('Customer Success')}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedDept === 'Customer Success' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
                    >
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
                   <Activity className="size-5 text-cyan-400" /> {selectedDept} Department Sub-Twin
                 </CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/50 uppercase font-semibold mb-1">Resource Load</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{stats.load}%</p>
                    <p className={`text-[10px] mt-1 ${stats.load > 85 ? 'text-red-400 font-bold' : stats.load > 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {stats.load > 85 ? 'Overloaded' : stats.load > 75 ? 'Capacity Warning' : 'Optimal Capacity'}
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/50 uppercase font-semibold mb-1">Process Efficiency</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{stats.efficiency}<span className="text-sm text-white/40">/100</span></p>
                    <p className={`text-[10px] mt-1 ${stats.efficiency > 90 ? 'text-emerald-400' : stats.efficiency > 80 ? 'text-sky-400' : 'text-amber-400'}`}>
                      {stats.efficiency > 90 ? 'High Efficiency' : stats.efficiency > 80 ? 'Good' : 'Needs Optimization'}
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/50 uppercase font-semibold mb-1">Cost Burn Rate</p>
                    <p className="text-2xl font-bold text-white tracking-tight">${stats.burn}k<span className="text-sm text-white/40">/mo</span></p>
                    <p className="text-[10px] text-white/40 mt-1">Steady State</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="glass-card border-white/10 flex flex-col">
               <CardHeader className="pb-3 flex flex-row items-center justify-between">
                 <div>
                   <CardTitle className="text-lg text-white flex items-center gap-2">
                     <Layers className="size-5 text-purple-400" /> Simulation Sandbox
                   </CardTitle>
                   <p className="text-xs text-white/50 mt-1">Enable rules to see their simulated impacts on resources, efficiency, and burn rate above.</p>
                 </div>
                 <Button 
                   onClick={() => setIsModalOpen(true)}
                   className="bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 text-xs h-8"
                 >
                   <Plus className="size-3.5 mr-1" /> New Rule
                 </Button>
               </CardHeader>
               <CardContent className="border-t border-white/5 p-6 relative">
                  <div className="w-full space-y-3">
                     {rules.map((rule) => (
                       <div 
                         key={rule.id} 
                         onClick={() => toggleRule(rule.id)}
                         className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                           rule.active 
                             ? 'bg-purple-500/10 border-purple-500/40 text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                             : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                         }`}
                       >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{rule.name}</span>
                              {rule.active && <Badge className="bg-purple-500 text-white text-[10px] py-0 px-1">Active</Badge>}
                            </div>
                            <span className="text-[10px] text-white/40">{rule.details}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                             <div className={`px-2.5 py-1 text-xs rounded-lg text-center font-medium ${
                               rule.type === 'positive' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                             }`}>
                                {rule.effect}
                             </div>
                             <div className={`size-5 rounded border flex items-center justify-center transition-colors ${
                               rule.active ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/20 text-transparent'
                             }`}>
                               <Check className="size-3.5 stroke-[3px]" />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* New Simulation Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md bg-[#0a0a0c] border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-white text-lg font-bold">New Simulation Rule</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreateRule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Rule Name</label>
                <Input 
                  required 
                  placeholder="e.g. Upgrade dev tools" 
                  value={newRuleName} 
                  onChange={e => setNewRuleName(e.target.value)} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Primary Impact/Effect</label>
                <Input 
                  required 
                  placeholder="e.g. Efficiency increases by 10%" 
                  value={newRuleEffect} 
                  onChange={e => setNewRuleEffect(e.target.value)} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Cost / Burn Rate Details</label>
                <Input 
                  placeholder="e.g. Burn rate +$20k/mo" 
                  value={newRuleDetails} 
                  onChange={e => setNewRuleDetails(e.target.value)} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">Add Rule</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
