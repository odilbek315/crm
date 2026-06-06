import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Blocks, Link2, Plus, LayoutTemplate, Share2, Component } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function EcosystemBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Blocks className="size-8 text-purple-400" /> Platform Architecture
          </h1>
          <p className="text-white/60 mt-1 text-sm">No-Code Application Builder & Integration Hub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Integration Hub */}
         <Card className="glass-card border-white/10 flex flex-col h-full">
            <CardHeader className="pb-4">
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Link2 className="size-5 text-sky-400" /> Integration Hub
               </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               {[
                 { name: 'Google Workspace', status: 'Active', bg: 'bg-white/5' },
                 { name: 'Telegram Bot API', status: 'Active', bg: 'bg-sky-500/10' },
                 { name: 'Stripe Payments', status: 'Active', bg: 'bg-indigo-500/10' },
                 { name: 'SAP S/4HANA', status: 'Configuring', bg: 'bg-amber-500/10' },
                 { name: 'WhatsApp Business', status: 'Inactive', bg: 'bg-white/5' }
               ].map((int, i) => (
                 <div key={i} className={`flex items-center justify-between p-3 rounded-lg border border-white/5 ${int.bg}`}>
                   <span className="font-medium text-white/90 text-sm">{int.name}</span>
                   <Badge className={`text-[10px] uppercase border-transparent ${
                     int.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                     int.status === 'Configuring' ? 'bg-amber-500/20 text-amber-400' :
                     'bg-white/10 text-white/40'
                   }`}>{int.status}</Badge>
                 </div>
               ))}
               <Button className="w-full mt-4 bg-white/5 border border-white/10 text-white hover:bg-white/10">
                 Browse Connectors
               </Button>
            </CardContent>
         </Card>

         {/* No-Code Component Builder */}
         <div className="space-y-6">
            <Card className="glass-card border-white/10 bg-gradient-to-br from-purple-900/20 to-black">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <LayoutTemplate className="size-5 text-purple-400" />
                     <h3 className="font-semibold text-white">No-Code App Builder</h3>
                   </div>
                   <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Beta</Badge>
                 </div>
                 <p className="text-sm text-white/60 mb-6">Design custom pages, forms, and workflows using drag-and-drop primitives.</p>
                 <div className="flex gap-3">
                   <Button className="bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">
                     <Plus className="size-4 mr-2" /> Create App
                   </Button>
                 </div>
               </CardContent>
            </Card>

            <Card className="glass-card border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Component className="size-24 text-white" />
               </div>
               <CardContent className="p-6 relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                   <Share2 className="size-5 text-white/70" />
                   <h3 className="font-semibold text-white">Custom Entity Schema</h3>
                 </div>
                 <p className="text-sm text-white/50 mb-6">Define virtual database tables and relationships (e.g. Vehicles, Properties) directly in the UI without migrations.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="p-3 bg-black/40 border border-white/5 rounded flex justify-between items-center">
                      <span className="text-sm font-medium text-white/80">Vehicle Fleet (Custom)</span>
                      <span className="text-[10px] text-emerald-400 font-mono">14 Fields</span>
                   </div>
                 </div>

                 <Button variant="outline" className="w-full border-dashed border-white/20 text-white/60 hover:text-white bg-transparent">
                   + Add Custom Entity
                 </Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
