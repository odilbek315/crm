import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Code, Terminal, Key, Webhook, Cpu, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export function DeveloperCenterPage() {
  const [keys] = useState([
    { id: 'key-1', name: 'Production API', prefix: 'pk_live_...', lastUsed: '2 mins ago', scopes: ['read:crm', 'write:deals'] },
    { id: 'key-2', name: 'Testing Sandbox', prefix: 'pk_test_...', lastUsed: '3 days ago', scopes: ['read:all'] },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Code className="size-8 text-emerald-400" /> Developer Center
          </h1>
          <p className="text-white/60 mt-1 text-sm">API Management, Webhooks, and SDK Sandboxes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* API Keys */}
         <Card className="lg:col-span-2 glass-card border-white/10 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Key className="size-5 text-white/70" /> API Keys
               </CardTitle>
               <Button size="sm" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30">
                 Generate Key
               </Button>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {keys.map(k => (
                    <div key={k.id} className="flex flex-col sm:flex-row justify-between p-4 bg-black/40 border border-white/5 rounded-xl gap-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{k.name}</span>
                            <Badge className="bg-white/10 text-white/50 border-white/10 text-[10px] uppercase">{k.scopes.join(', ')}</Badge>
                          </div>
                          <p className="text-xs font-mono text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-1 rounded inline-block">
                            {k.prefix}
                          </p>
                       </div>
                       <div className="flex flex-col justify-between sm:items-end">
                          <span className="text-xs text-white/40">Last used: {k.lastUsed}</span>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 h-6 px-2 mt-2 sm:mt-0">Revoke</Button>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         {/* Webhooks Config */}
         <Card className="lg:col-span-1 glass-card border-white/10">
            <CardHeader>
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Webhook className="size-5 text-white/70" /> Active Webhooks
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 <div className="p-3 bg-black/40 border border-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-medium text-white text-sm">FinTech Sync</span>
                       <CheckCircle className="size-4 text-emerald-400" />
                    </div>
                    <p className="text-[10px] font-mono text-white/40 break-all mb-2">https://api.fintech.com/webhook/erp</p>
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/60">InvoiceCreated</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/60">PaymentFailed</span>
                    </div>
                 </div>
                 
                 <Button variant="outline" className="w-full border-dashed border-white/20 text-white/60 hover:text-white bg-transparent">
                   + Add Webhook Endpoint
                 </Button>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-3 glass-card border-white/10 bg-black/60">
            <CardContent className="p-0 flex flex-col md:flex-row">
               <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
                 <Cpu className="size-10 text-sky-400 mb-4" />
                 <h3 className="text-lg font-semibold text-white mb-2">SDK & Documentation</h3>
                 <p className="text-sm text-white/50 mb-6">Access official SDKs for Node.js, Python, and Go. Read the OpenAPI 3.0 specs.</p>
                 <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/10 self-start">
                   View API Reference
                 </Button>
               </div>
               <div className="p-6 md:w-2/3 bg-[#0d1117]">
                 <div className="flex items-center gap-2 mb-4 text-white/40 text-xs font-mono border-b border-white/5 pb-2">
                   <Terminal className="size-4" /> <span>curl_example.sh</span>
                 </div>
                 <pre className="text-xs font-mono text-emerald-300 overflow-x-auto">
                   <code>
<span className="text-pink-400">curl</span> -X POST https://api.market-erp.local/v1/crm/leads \<br/>
  -H <span className="text-amber-300">"Authorization: Bearer pk_live_..."</span> \<br/>
  -H <span className="text-amber-300">"Content-Type: application/json"</span> \<br/>
  -d <span className="text-sky-300">'{'{'} "companyName": "Acme", "email": "contact@acme.com" {'}'}'</span>
                   </code>
                 </pre>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
