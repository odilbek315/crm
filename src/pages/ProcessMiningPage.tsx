import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Search, TrendingDown, Hourglass, Settings2, Sparkles, Workflow, Zap, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useProcessMining } from '../frontend/hooks/useAnalytics';

export function ProcessMiningPage() {
  const { data: miningData, isLoading } = useProcessMining();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-fuchsia-400" />
        <span className="ml-3 text-white/70">Biznes jarayonlari tahlil qilinmoqda (Process Mining)...</span>
      </div>
    );
  }

  const customerToDeal = miningData?.customerToDealDays || "2.5";
  const dealToInvoice = miningData?.dealToInvoiceDays || "4.1";
  const totalCycle = miningData?.totalCycleDays || "6.6";
  const bottlenecks = miningData?.bottlenecksDetected ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Search className="size-8 text-fuchsia-400" /> Process Mining Tahlili
          </h1>
          <p className="text-white/60 mt-1 text-sm">Tizimdagi real amallar loglaridan aniqlangan ish oqimi samaradorligi va optimallashtirish nuqtalari.</p>
        </div>
      </div>

      {/* Aggregated KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-red-500">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2">
            <Hourglass className="size-4" /> Bottleneck-lar (Kechikishlar)
          </span>
          <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">
            {bottlenecks} <span className="text-sm font-normal text-white/40">ta aniqlangan</span>
          </p>
        </Card>
        
        <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-amber-500">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2">
            <TrendingDown className="size-4" /> O'rtacha Tsikl Davomiyligi
          </span>
          <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">
            {totalCycle} <span className="text-xl">kun</span>
          </p>
        </Card>

        <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-fuchsia-500">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2">
            <Sparkles className="size-4" /> Optimallashtirish Takliflari
          </span>
          <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">
            3 <span className="text-sm font-normal text-emerald-400">ko'rib chiqishga tayyor</span>
          </p>
        </Card>
      </div>

      {/* Discovered Process Map & Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Map */}
        <Card className="glass-card border-white/10 h-[500px] flex flex-col">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Workflow className="size-5 text-white/60" /> Discovered Process Map (Jarayonlar Xaritasi)
            </CardTitle>
            <CardDescription className="text-white/50">Mijoz yaratilishidan boshlab hisob-faktura to'lanishigacha bo'lgan real bosqichlar.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 relative flex items-center justify-center p-0 overflow-hidden bg-[#0a0a0f]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
              {/* Step 1: Customer Creation */}
              <div className="flex flex-col items-center">
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm">
                  1. Mijoz Yaratildi (CREATE_CUSTOMER)
                </Badge>
                
                {/* Arrow & Cycle duration */}
                <div className="flex flex-col items-center my-4">
                  <div className="w-0.5 h-12 bg-white/20 relative">
                    <div className="absolute -bottom-1 -left-1 border-[4px] border-transparent border-t-white/30"></div>
                  </div>
                  <span className="text-xs text-white/50 bg-black/40 border border-white/5 px-2 py-0.5 rounded font-mono mt-1">
                    {customerToDeal} kun
                  </span>
                </div>
              </div>

              {/* Step 2: Deal Closed Won */}
              <div className="flex flex-col items-center">
                <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm">
                  2. Bitim Yutildi (DEAL_STAGE_CHANGED: Won)
                </Badge>
                
                {/* Arrow & Cycle duration */}
                <div className="flex flex-col items-center my-4">
                  <div className="w-0.5 h-12 bg-white/20 relative">
                    <div className="absolute -bottom-1 -left-1 border-[4px] border-transparent border-t-white/30"></div>
                  </div>
                  <span className="text-xs text-white/50 bg-black/40 border border-white/5 px-2 py-0.5 rounded font-mono mt-1">
                    {dealToInvoice} kun
                  </span>
                </div>
              </div>

              {/* Step 3: Invoice Paid */}
              <div className="flex flex-col items-center">
                <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm">
                  3. Faktura To'landi (INVOICE_PAID)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Proposals */}
        <Card className="glass-card border-white/10 bg-gradient-to-b from-[#0f0b15] to-black h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Zap className="size-5 text-fuchsia-400" /> Avtonom Optimallashtirish Takliflari
            </CardTitle>
            <CardDescription className="text-white/60">Bottleneck-larni avtomatlashtirish orqali tezkor bartaraf etish rejalari.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {[
              { 
                title: 'Savdo Tsiklini Avtomatlashtirish', 
                desc: `Mijoz yaratilgandan so'ng bitimni muvaffaqiyatli yopishgacha o'rtacha ${customerToDeal} kun sarflanmoqda. Buni qisqartirish uchun avtomatik uchrashuv belgilash va eslatma tizimi tavsiya etiladi.`, 
                impact: 'High', 
                type: 'Workflow Edit' 
              },
              { 
                title: 'Hisob-faktura To\'lov Muddatini Qisqartirish', 
                desc: `Bitim yutilganidan hisob-faktura yopilgunicha ${dealToInvoice} kun vaqt ketmoqda. Avtomatik to'lov eslatmalari va oqimni nazorat qilish 1.5 kunga qisqartirishi mumkin.`, 
                impact: 'Critical', 
                type: 'Logic Update' 
              },
              { 
                title: 'Hujjatlarni Tayyorlashni Tezlashing', 
                desc: 'Bitim yutilgan vaqtda shartnomalarni avtomatik tayyorlash funksiyasi ishga tushirilsa, bitim-faktura davrini sezilarli tezlashtirish imkonini beradi.', 
                impact: 'Medium', 
                type: 'Resource' 
              },
            ].map((prop, i) => (
              <div key={i} className="p-4 bg-black/40 border border-white/10 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-colors">
                <div className="absolute top-0 right-0 p-3">
                  <Badge className={`text-[10px] uppercase border-transparent ${prop.impact === 'Critical' ? 'bg-red-500/20 text-red-400' : prop.impact === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/50'}`}>
                    Impact: {prop.impact}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2 pr-20">
                  <Settings2 className="size-4 text-fuchsia-400" /> 
                  <h4 className="font-semibold text-white/90 text-sm">{prop.title}</h4>
                </div>
                <p className="text-xs text-white/60 mb-4">{prop.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">{prop.type}</span>
                  <Button size="sm" className="bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 border border-fuchsia-500/30 h-7 text-xs cursor-pointer">
                    Taklifni Qo'llash
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProcessMiningPage;
