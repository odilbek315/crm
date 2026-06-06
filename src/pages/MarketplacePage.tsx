import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Store, Download, Star, StarHalf, Search, CheckCircle, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const mockApps = [
  { id: '1', name: 'Advanced HR Analytics', vendor: 'Market ERP Inc.', rating: 4.8, type: 'Official', inst: true, desc: 'Deep analytics and attrition prediction for HR.' },
  { id: '2', name: 'Stripe Billing Sync', vendor: 'FinTech Solutions', rating: 4.9, type: 'Verified', inst: false, desc: 'Two-way sync between ERP Invoices and Stripe.' },
  { id: '3', name: 'Zendesk Connector', vendor: 'SupportCloud', rating: 4.5, type: 'Verified', inst: false, desc: 'Bind support tickets to CRM customers automatically.' },
  { id: '4', name: 'Jira Project Link', vendor: 'AgileTools', rating: 4.2, type: 'Community', inst: true, desc: 'Link sales deals to engineering tasks.' },
];

export function MarketplacePage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Store className="size-8 text-sky-400" /> App Marketplace
          </h1>
          <p className="text-white/60 mt-1 text-sm">Extend Market ERP with plugins, connectors, and intelligence modules.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 text-white/70 hover:text-white bg-transparent">
             Developer Portal
           </Button>
           <Button className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30">
             Submit App
           </Button>
        </div>
      </div>

      <div className="relative w-full max-w-xl">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
         <Input 
           placeholder="Search apps, integrations, or plugins..." 
           className="pl-9 bg-black/60 border-white/10 text-white placeholder:text-white/30 h-12"
           value={search}
           onChange={e => setSearch(e.target.value)}
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
         {mockApps.map(app => (
           <Card key={app.id} className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors relative group overflow-hidden flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                    <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                      {app.name.charAt(0)}
                    </div>
                    {app.inst ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle className="size-3 mr-1" /> Installed</Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/60 border-white/10 line-clamp-1">{app.type}</Badge>
                    )}
                 </div>
                 
                 <h3 className="font-semibold text-white mb-1">{app.name}</h3>
                 <p className="text-xs text-white/40 mb-3 font-mono">{app.vendor}</p>
                 <p className="text-sm text-white/60 mb-6 flex-1">{app.desc}</p>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center text-amber-400 text-xs font-medium">
                      <Star className="size-3.5 fill-current mr-1" />
                      {app.rating}
                    </div>
                    {!app.inst && (
                      <Button size="sm" className="bg-white/10 text-white hover:bg-white/20 h-7 text-xs border border-white/10">
                        <Download className="size-3 mr-1" /> Install
                      </Button>
                    )}
                 </div>
              </CardContent>
           </Card>
         ))}

         <Card className="glass-card border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-white/5 transition-colors">
            <Zap className="size-8 text-white/30 mb-3" />
            <p className="text-sm font-medium text-white/70">Request Integration</p>
         </Card>
      </div>
    </div>
  );
}
