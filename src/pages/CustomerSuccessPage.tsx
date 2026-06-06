import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Heart, Activity, Target, ShieldAlert, ArrowUpRight, ArrowDownRight, Users, MessageCircle, Loader2, Check } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/Toast';

export function CustomerSuccessPage() {
  const { toast } = useToast();
  const [reviewing, setReviewing] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});

  const handleReview = (name: string) => {
    setReviewing(prev => ({ ...prev, [name]: true }));
    setTimeout(() => {
      setReviewing(prev => ({ ...prev, [name]: false }));
      setReviewed(prev => ({ ...prev, [name]: true }));
      toast({
        title: "Review Complete",
        description: `Action plan for ${name} has been auto-generated.`,
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Heart className="size-8 text-rose-400 fill-rose-400/20" /> Customer Success Center
          </h1>
          <p className="text-white/60 mt-1 text-sm">Predictive health scoring and engagement metrics for account retention.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="glass-card border-white/10 p-5 bg-gradient-to-br from-emerald-900/20 to-black hover:from-emerald-900/30 transition-colors cursor-pointer" onClick={() => toast({ title: "Healthy Accounts", description: "O'tgan oyga nisbatan 4% o'sish." })}>
           <span className="text-xs text-white/50 uppercase font-semibold block mb-2">Healthy Accounts</span>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-white">1,240</span>
             <span className="text-xs text-emerald-400">82% of total</span>
           </div>
         </Card>
         <Card className="glass-card border-white/10 p-5 bg-gradient-to-br from-amber-900/20 to-black hover:from-amber-900/30 transition-colors cursor-pointer" onClick={() => toast({ title: "At Risk Accounts", description: "Marketing jamoasiga hisobot yuborildi." })}>
           <span className="text-xs text-white/50 uppercase font-semibold block mb-2">At Risk</span>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-white">84</span>
             <span className="text-xs text-amber-400 drop-shadow-md">+12 this week</span>
           </div>
         </Card>
         <Card className="glass-card border-white/10 p-5 bg-gradient-to-br from-red-900/20 to-black hover:from-red-900/30 transition-colors cursor-pointer" onClick={() => toast({ title: "Critical Churn", description: "Boshqaruv bo'limi aralashuvi talab etiladi." })}>
           <span className="text-xs text-white/50 uppercase font-semibold block mb-2">Critical Churn Risk</span>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-white">12</span>
             <span className="text-xs text-red-400">Requires Action</span>
           </div>
         </Card>
         <Card className="glass-card border-white/10 p-5 border-t-2 border-t-sky-500 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toast({ title: "Health Score", description: "Tashkilot umumiy salomatligi normal." })}>
           <span className="text-xs text-white/50 uppercase font-semibold block mb-2">Avg. Health Score</span>
           <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-white">88<span className="text-lg text-white/40">/100</span></span>
           </div>
         </Card>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
           <CardTitle className="text-lg text-white font-semibold">Priority Accounts For Review</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="text-xs uppercase text-white/40 bg-black/40 border-y border-white/10">
                <tr>
                   <th className="px-4 py-3 font-semibold">Account</th>
                   <th className="px-4 py-3 font-semibold">Health Score</th>
                   <th className="px-4 py-3 font-semibold">ARR</th>
                   <th className="px-4 py-3 font-semibold">Risk Factors</th>
                   <th className="px-4 py-3 font-semibold">Last Contact</th>
                   <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-white/80">
                {[
                  { name: 'OmniCorp Global', score: 34, arr: '$120k', risk: 'Low login volume & Overdue Invoice', contact: '14 days ago', critical: true },
                  { name: 'Stark Industries', score: 45, arr: '$240k', risk: 'Multiple severe support tickets', contact: '2 days ago', critical: true },
                  { name: 'Wayne Enterprises', score: 68, arr: '$85k', risk: 'Declining feature usage', contact: '30 days ago', critical: false },
                  { name: 'Cyberdyne', score: 92, arr: '$450k', risk: 'None - Ready for upsell', contact: 'Yesterday', critical: false },
                ].map((acc, i) => {
                  const isReviewing = reviewing[acc.name];
                  const isReviewed = reviewed[acc.name];
                  
                  return (
                    <tr key={i} className={`hover:bg-white/5 transition-colors ${isReviewed ? 'opacity-50' : ''}`}>
                       <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                         <BuildingIcon className="size-4 text-white/40" /> {acc.name}
                       </td>
                       <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                               <div className={`h-full ${acc.score < 50 ? 'bg-red-500' : acc.score < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${acc.score}%` }}></div>
                            </div>
                            <span className={`font-mono text-xs ${acc.score < 50 ? 'text-red-400' : acc.score < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>{acc.score}</span>
                          </div>
                       </td>
                       <td className="px-4 py-4 font-mono">{acc.arr}</td>
                       <td className="px-4 py-4 max-w-xs truncate text-xs text-white/60">{acc.risk}</td>
                       <td className="px-4 py-4 text-xs text-white/50">{acc.contact}</td>
                       <td className="px-4 py-4 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            disabled={isReviewing || isReviewed}
                            onClick={() => handleReview(acc.name)}
                            className={`h-8 text-xs hover:bg-white/10 text-white border border-white/5 ${isReviewed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}`}
                          >
                            {isReviewing ? <Loader2 className="size-3 animate-spin mr-1" /> : isReviewed ? <Check className="size-3 mr-1" /> : null}
                            {isReviewed ? 'Reviewed' : 'Review'}
                          </Button>
                       </td>
                    </tr>
                  )
                })}
             </tbody>
          </table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="glass-card border-white/10">
           <CardHeader>
             <CardTitle className="text-lg text-white">Sentiment Analysis (Aggregated)</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                 <p className="text-sm text-white/60 mb-2">Analyzed from 12,400 communication signals (emails, support tickets, chat logs) using NLP engine.</p>
                 <div className="flex h-4 rounded-full overflow-hidden mb-2">
                    <div className="bg-emerald-500 w-[65%] hover:opacity-80 transition-opacity cursor-pointer" title="65% Positive" onClick={() => toast({ title: "Positive Sentiment", description: "Asosan maxsulotning yangi versiyasi haqida ijobiy fikrlar." })}></div>
                    <div className="bg-amber-500 w-[25%] hover:opacity-80 transition-opacity cursor-pointer" title="25% Neutral" onClick={() => toast({ title: "Neutral Sentiment", description: "Umumiy so'rovnomalar va savollar." })}></div>
                    <div className="bg-red-500 w-[10%] hover:opacity-80 transition-opacity cursor-pointer" title="10% Negative" onClick={() => toast({ title: "Negative Sentiment", description: "Texnik nosozliklar haqidagi shikoyatlar." })}></div>
                 </div>
                 <div className="flex justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-emerald-500" /> Positive (65%)</span>
                    <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-500" /> Neutral (25%)</span>
                    <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-red-500" /> Negative (10%)</span>
                 </div>
              </div>
           </CardContent>
         </Card>
         
         <Card className="glass-card border-white/10">
           <CardHeader>
             <CardTitle className="text-lg text-white">Support Impact Velocity</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => toast({ title: "Resolution Time", description: "O'tgan haftaga nisbatan yaxshilandi." })}>
                 <div className="flex items-center gap-3">
                    <MessageCircle className="size-4 text-white/40" />
                    <div><p className="text-sm text-white">Avg. Time to Resolution</p></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-white">4.2 hours</span>
                    <span className="text-xs text-emerald-400 flex items-center">-12% <ArrowDownRight className="size-3" /></span>
                 </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer" onClick={() => toast({ title: "Escalation Rate", description: "So'nggi yangilanish tufayli ko'paygan.", type: "warning" })}>
                 <div className="flex items-center gap-3">
                    <ShieldAlert className="size-4 text-white/40" />
                    <div><p className="text-sm text-white">Escalation Rate</p></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-white">3.1%</span>
                    <span className="text-xs text-red-400 flex items-center">+0.5% <ArrowUpRight className="size-3" /></span>
                 </div>
              </div>
           </CardContent>
         </Card>
      </div>

    </div>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
