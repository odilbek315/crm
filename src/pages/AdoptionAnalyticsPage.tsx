import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { PieChart, Pointer, Ban, Rocket, Lightbulb, Box, Loader2, Check } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/Toast';
import { Input } from '../components/ui/input';

interface Recommendation {
  id: string;
  title: string;
  desc: string;
  actionText: string;
  type: 'configure' | 'archive' | 'plugin';
}

export function AdoptionAnalyticsPage() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    { id: '1', title: 'Underutilized Feature: BI Analytics', desc: 'Only 15% of managers are accessing custom dashboards. AI suggests auto-emailing weekly PDF summaries to boost engagement.', actionText: 'Configure Auto-Reports', type: 'configure' },
    { id: '2', title: 'Obsolete Workflow Detected', desc: 'The "Expense Pre-Approval" workflow hasn\'t been triggered in 90 days since the new policy rollout. Suggest disabling.', actionText: 'Archive Workflow', type: 'archive' },
    { id: '3', title: 'Automation Opportunity', desc: 'HR is manually uploading 40+ onboarding documents daily. Recommend enabling the "Google Drive Sync" plugin.', actionText: 'View Plugin Setup', type: 'plugin' }
  ]);

  const [activeModal, setActiveModal] = useState<'none' | 'reports' | 'plugin'>('none');
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Auto-reports state
  const [emailList, setEmailList] = useState('manager@company.com');
  const [frequency, setFrequency] = useState('weekly');

  // Plugin state
  const [isInstallingPlugin, setIsInstallingPlugin] = useState(false);

  const handleAction = (rec: Recommendation) => {
    if (rec.type === 'configure') {
      setActiveModal('reports');
    } else if (rec.type === 'plugin') {
      setActiveModal('plugin');
    } else if (rec.type === 'archive') {
      setLoadingActionId(rec.id);
      setTimeout(() => {
        setRecommendations(prev => prev.filter(r => r.id !== rec.id));
        setLoadingActionId(null);
        toast({
          title: "Ish oqimi arxivlandi",
          description: "Eski 'Expense Pre-Approval' ish oqimi muvaffaqiyatli arxivlandi.",
          type: "success"
        });
      }, 1200);
    }
  };

  const handleSaveReports = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal('none');
    toast({
      title: "Avtomatik hisobotlar sozlandi",
      description: `Hisobotlar ${frequency} shaklda ${emailList} manziliga yuboriladi.`,
      type: "success"
    });
  };

  const handleInstallPlugin = () => {
    setIsInstallingPlugin(true);
    setTimeout(() => {
      setIsInstallingPlugin(false);
      toast({
        title: "Plagin muvaffaqiyatli o'rnatildi",
        description: "Google Drive Sync plagini HR moduli bilan bog'landi.",
        type: "success"
      });
      // Remove recommendation since it's installed
      setRecommendations(prev => prev.filter(r => r.type !== 'plugin'));
      setActiveModal('none');
    }, 2000);
  };

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
           <p className="text-3xl font-display font-bold text-red-400 tracking-tight">{recommendations.filter(r => r.type === 'archive').length > 0 ? 12 : 11}</p>
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
            <CardContent className="space-y-4">
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
            </CardContent>
         </Card>

         <Card className="glass-card border-white/10 bg-gradient-to-br from-amber-950/20 to-black">
            <CardHeader>
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Lightbulb className="size-5 text-amber-400" /> Process Recommendation Center
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {recommendations.length === 0 ? (
                 <div className="p-8 text-center text-white/40 text-sm flex flex-col items-center justify-center gap-2">
                   <Check className="size-8 text-emerald-400" />
                   Tavsiyalar mavjud emas. Tizim to'liq optimallashgan.
                 </div>
               ) : (
                 recommendations.map((rec) => (
                   <div key={rec.id} className="p-4 bg-black/40 border border-white/10 rounded-xl relative overflow-hidden">
                      <h4 className="font-semibold text-white/90 mb-1">{rec.title}</h4>
                      <p className="text-xs text-white/60 mb-3">{rec.desc}</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleAction(rec)}
                        disabled={loadingActionId === rec.id}
                        className={`text-xs h-7 border flex items-center gap-1.5 bg-transparent ${
                          rec.type === 'configure' 
                            ? 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10' 
                            : rec.type === 'archive' 
                              ? 'border-red-500/30 text-red-300 hover:bg-red-500/10' 
                              : 'border-white/20 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {loadingActionId === rec.id && <Loader2 className="size-3 animate-spin" />}
                        {rec.actionText}
                      </Button>
                   </div>
                 ))
               )}
            </CardContent>
         </Card>
      </div>

      {/* Configure Auto-Reports Modal */}
      {activeModal === 'reports' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0c] border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-white text-lg font-bold">Configure BI Auto-Reports</CardTitle>
            </CardHeader>
            <form onSubmit={handleSaveReports} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Email List (separated by commas)</label>
                <Input 
                  required 
                  value={emailList} 
                  onChange={e => setEmailList(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Frequency</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                >
                  <option value="daily" className="bg-[#0a0a0a]">Daily</option>
                  <option value="weekly" className="bg-[#0a0a0a]">Weekly</option>
                  <option value="monthly" className="bg-[#0a0a0a]">Monthly</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setActiveModal('none')}>Cancel</Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">Save Configuration</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* View Plugin Setup Modal */}
      {activeModal === 'plugin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0c] border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-white text-lg font-bold">Google Drive Sync Plugin</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <p className="text-sm text-white/70 leading-relaxed">
                Google Drive Sync plaginini faollashtirish orqali HR modulidagi barcha shartnoma va hujjatlar avtomatik tarzda Google bulutli xotirasiga yuklanadi va sinxronlanadi.
              </p>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs space-y-1 text-white/60">
                <p><strong>Dasturchi:</strong> Global Tech Corp</p>
                <p><strong>Versiya:</strong> v1.2.4 (O'rnatishga tayyor)</p>
                <p><strong>Ruxsatlar:</strong> File read/write, storage integration</p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setActiveModal('none')}>Cancel</Button>
                <Button 
                  type="button" 
                  onClick={handleInstallPlugin} 
                  disabled={isInstallingPlugin}
                  className="bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-1.5"
                >
                  {isInstallingPlugin && <Loader2 className="size-4 animate-spin" />}
                  {isInstallingPlugin ? "Installing..." : "Install Plugin"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
