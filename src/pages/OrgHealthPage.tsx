import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Activity, HeartPulse, Target, TrendingUp, RefreshCcw, Handshake, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/Toast';
import { TiltCard } from '../components/ui/TiltCard';

export function OrgHealthPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState([
    { label: 'Operatsion samaradorlik', score: 92, color: 'bg-emerald-500', icon: Activity },
    { label: 'Mijozlar muvaffaqiyati', score: 85, color: 'bg-sky-500', icon: Handshake },
    { label: 'Xodimlar farovonligi', score: 76, color: 'bg-amber-500', icon: HeartPulse },
    { label: 'Daromad va oʻsish', score: 96, color: 'bg-purple-500', icon: TrendingUp },
  ]);

  const globalScore = Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length);

  const runDiagnostics = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Vary metrics randomly
      setMetrics(prev => prev.map(m => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return {
          ...m,
          score: Math.min(100, Math.max(50, m.score + delta))
        };
      }));
      setIsAnalyzing(false);
      toast({
        title: "Diagnostika muvaffaqiyatli yakunlandi",
        description: `Tashkilotning yangi salomatlik indeksi: ${globalScore}/100.`,
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <HeartPulse className="size-8 text-emerald-400" /> Tashkilotning umumiy salomatlik indeksi
          </h1>
          <p className="text-white/60 mt-1 text-sm">Ishlab chiqarish samaradorligi, mijozlar muvaffaqiyati, xodimlar farovonligi va umumiy samaradorlikni qamrab oluvchi kompleks baholash.</p>
        </div>
        <Button 
          onClick={runDiagnostics} 
          disabled={isAnalyzing}
          className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-2"
        >
          {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
          Diagnostikani boshlash
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-emerald-900/20 to-transparent">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Umumiy salomatlik koʻrsatkichi</span>
            <div className="relative size-32 rounded-full flex items-center justify-center">
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                 <circle 
                   cx="64" 
                   cy="64" 
                   r="56" 
                   fill="transparent" 
                   stroke="currentColor" 
                   strokeWidth="8" 
                   className="text-emerald-500/20"
                 ></circle>
                 <circle 
                   cx="64" 
                   cy="64" 
                   r="56" 
                   fill="transparent" 
                   stroke="#10b981" 
                   strokeWidth="8" 
                   strokeDasharray="351" 
                   strokeDashoffset={351 - (351 * globalScore) / 100} 
                   className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                   strokeLinecap="round"
                 ></circle>
               </svg>
               <div className="flex flex-col items-center z-10">
                  <span className="text-4xl font-bold text-white">{globalScore}</span>
                  <span className="text-[10px] text-emerald-400">Jonli tahlil</span>
               </div>
            </div>
         </Card>

         <Card className="glass-card border-white/10 p-6 lg:col-span-2">
            <CardTitle className="text-sm text-white/70 uppercase tracking-widest font-semibold mb-6 flex items-center gap-2">
              <Target className="size-4" /> Tarkibiy qismlar boʻyicha taqsimot
            </CardTitle>
            <div className="space-y-5">
               {metrics.map((comp, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <div className="p-2 rounded-lg bg-white/5">
                        <comp.icon className="size-4 text-white/70" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-white/90">{comp.label}</span>
                          <span className="text-sm font-mono text-white/60">{comp.score}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${comp.color} transition-all duration-500`} style={{ width: `${comp.score}%` }}></div>
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
              <RefreshCcw className="size-5 text-sky-400" /> Uzluksiz takomillashtirish tizimi
            </CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-sm text-white/60 mb-6">Qoʻllanilgan avtonom optimizatsiyalarning uzoq muddatli taʼsirini kuzatish va baholash.</p>
            
            <div className="space-y-4">
               {[
                 { name: 'Ortiqcha tasdiqlashni birlashtirish (Moliya)', applied: '2 hafta oldin', before: '4.2 kun/inv', after: '1.4 kun/inv', impact: 'Yuqori (+66% tezlashdi)' },
                 { name: 'AI mijozlarni yoʻnaltirish siyosati', applied: '1 oy oldin', before: '22% tushish', after: '5% tushish', impact: 'Muhim (+17% qamrov)' },
                 { name: '2-darajali qoʻllab-quvvatlash yukini taqsimlash', applied: '2 oy oldin', before: '14 soat kutish vaqti', after: '6 soat kutish vaqti', impact: 'Oʻrtacha (+57% tezlashdi)' },
               ].map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-black/40 border border-white/5 rounded-xl items-center">
                     <div className="md:col-span-1">
                        <h4 className="font-semibold text-sm text-white/90">{item.name}</h4>
                        <span className="text-[10px] text-white/40">Qoʻllanilgan: {item.applied}</span>
                     </div>
                     <div className="md:col-span-1 text-center bg-white/5 p-2 rounded">
                        <p className="text-[10px] text-white/40 uppercase mb-1">Optimallashtirishdan oldin</p>
                        <p className="text-sm font-mono text-red-300">{item.before}</p>
                     </div>
                     <div className="md:col-span-1 text-center bg-white/5 p-2 rounded border border-emerald-500/20">
                        <p className="text-[10px] text-white/40 uppercase mb-1">Hozirgi holat</p>
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