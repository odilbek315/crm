import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { BookOpen, Search, FileText, DatabaseZap, Shield, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function KnowledgePage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Knowledge Center</h1>
          <p className="text-white/60 mt-1 text-sm">Internal documents, policies, and AI RAG Architecture.</p>
        </div>
        <Button className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30">
          <Plus className="size-4 mr-2" />
          New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
         <Card className="lg:col-span-2 glass-card border-white/10 p-4 flex flex-col justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <Input 
                placeholder="Ask AI or search knowledge base..." 
                className="pl-9 bg-black/60 border-white/10 text-white placeholder:text-white/30 h-12"
              />
            </div>
         </Card>
         
         <Card className="lg:col-span-1 glass-card border-purple-500/30 bg-purple-500/5 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3">
               <DatabaseZap className="size-6 text-purple-400" />
               <div>
                  <h4 className="text-sm font-semibold text-white">RAG Vector Index</h4>
                  <p className="text-xs text-purple-300/70">Sync: Real-time • Status: Active</p>
               </div>
            </div>
         </Card>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="size-16 text-white" />
            </div>
            <CardContent className="p-6">
               <FileText className="size-8 text-sky-400 mb-4" />
               <h3 className="text-lg font-semibold text-white mb-2">Corporate Policies</h3>
               <p className="text-sm text-white/50 mb-4 line-clamp-2">Standard operating procedures, HR guidelines, and compliance documentation for all employees.</p>
               <div className="flex items-center justify-between text-xs text-white/30">
                 <span>12 Documents</span>
                 <span>Updated 2 days ago</span>
               </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer relative overflow-hidden group">
            <CardContent className="p-6">
               <BookOpen className="size-8 text-emerald-400 mb-4" />
               <h3 className="text-lg font-semibold text-white mb-2">Sales Playbooks</h3>
               <p className="text-sm text-white/50 mb-4 line-clamp-2">Scripts, objection handling, and product matrices used by the AI Sales Manager to score deals.</p>
               <div className="flex items-center justify-between text-xs text-white/30">
                 <span>8 Documents</span>
                 <span>Updated 1 week ago</span>
               </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] border-2 border-dashed border-white/10 rounded-xl bg-black/20">
               <Plus className="size-8 text-white/30 mb-2" />
               <h3 className="text-sm font-medium text-white/70">Create Folder</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
