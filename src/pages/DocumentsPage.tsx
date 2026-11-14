import React, { useState } from 'react';
import { Search, Plus, FileText, Loader2, HardDrive } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useDocuments } from '../frontend/hooks/useDocuments';

export function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch documents
  const { data: documents = [], isLoading, error } = useDocuments();

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBytes = documents.reduce((sum, d) => sum + (d.size || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Document Center</h1>
          <p className="text-white/60 mt-1 text-sm">Secure storage for contracts, invoices, and company files.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => alert("Hujjat yuklash funksiyasi tizim ma'lumotlar bazasi orqali boshqariladi.")} className="bg-white/10 text-white border border-white/20 hover:bg-white/20 cursor-pointer">
            <Plus className="size-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
           <div className="p-4 bg-sky-500/20 rounded-xl">
             <HardDrive className="size-6 text-sky-400" />
           </div>
           <div>
             <p className="text-sm font-medium text-white/50">Storage Used</p>
             <p className="text-2xl font-bold text-white mt-1">{totalMB} MB <span className="text-sm font-normal text-white/40">/ 100 MB</span></p>
           </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
           <div className="p-4 bg-emerald-500/20 rounded-xl">
             <FileText className="size-6 text-emerald-400" />
           </div>
           <div>
             <p className="text-sm font-medium text-white/50">Total Files</p>
             <p className="text-2xl font-bold text-white mt-1">{documents.length}</p>
           </div>
        </div>
      </div>

      <Card className="flex flex-col min-h-[500px] overflow-hidden border-white/10 glass-card backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Search documents by name..." 
              className="pl-9 bg-black/40 border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto custom-scrollbar p-6">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load documents from server</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {filteredDocs.map((doc) => {
                 const fileSizeMB = doc.size ? (doc.size / (1024 * 1024)).toFixed(2) : '0.00';
                 return (
                   <div key={doc.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col h-40 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-auto">
                        <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-sky-400">
                          <FileText className="size-5" />
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-white text-sm truncate pr-2 group-hover:text-sky-300 transition-colors mb-1">{doc.title}</p>
                        <div className="flex justify-between items-center text-xs text-white/40">
                          <span>{fileSizeMB} MB</span>
                          <span>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          )}
          {!isLoading && filteredDocs.length === 0 && (
            <div className="p-12 text-center text-white/50">
              Hujjatlar topilmadi.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default DocumentsPage;
