import React, { useState } from 'react';
import { Search, Plus, FileText, Download, Calendar, MoreVertical, HardDrive, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'PDF',
    size: 0,
    url: '',
    status: 'Active'
  });

  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/documents');
      return res.data.data as any[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/documents', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, form: typeof formData }) => api.patch(`/documents/${data.id}`, data.form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setEditingDoc(null);
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  const handleOpenModal = (doc?: any) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title,
        type: doc.type || 'PDF',
        size: doc.size || 0,
        url: doc.url || '',
        status: doc.status || 'Active'
      });
    } else {
      setEditingDoc(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', type: 'PDF', size: 0, url: '', status: 'Active' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      updateMutation.mutate({ id: editingDoc.id, form: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredDocs = documents?.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Document Center</h1>
          <p className="text-white/60 mt-1 text-sm">Secure storage for contracts, invoices, and company files.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal()} className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
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
             <p className="text-2xl font-bold text-white mt-1">45.2 GB <span className="text-sm font-normal text-white/40">/ 100 GB</span></p>
           </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
           <div className="p-4 bg-emerald-500/20 rounded-xl">
             <FileText className="size-6 text-emerald-400" />
           </div>
           <div>
             <p className="text-sm font-medium text-white/50">Total Files</p>
             <p className="text-2xl font-bold text-white mt-1">{documents?.length || 0}</p>
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
        
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-white/50" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load documents</div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar p-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group flex flex-col h-40 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     
                     <div className="flex justify-between items-start mb-auto">
                       <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-sky-400">
                         <FileText className="size-5" />
                       </div>
                       <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="size-8 text-white/40 hover:text-white" onClick={() => handleOpenModal(doc)}>
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 text-white/40 hover:text-red-400" onClick={() => deleteMutation.mutate(doc.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                       </div>
                     </div>
                     
                     <div>
                       <p className="font-medium text-white text-sm truncate pr-2 group-hover:text-sky-300 transition-colors mb-1">{doc.title}</p>
                       <div className="flex justify-between items-center text-xs text-white/40">
                         <span>{doc.size} KB • {doc.type}</span>
                         <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                       </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingDoc ? 'Edit Document' : 'Upload Document'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Type</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  {['PDF', 'DOCX', 'XLSX', 'IMAGE', 'OTHER'].map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Size (KB)</label>
                <Input type="number" value={formData.size} onChange={e => setFormData({...formData, size: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">URL / Link</label>
                <Input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Status</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active" className="bg-[#0a0a0a]">Active</option>
                  <option value="Archived" className="bg-[#0a0a0a]">Archived</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-sky-500 hover:bg-sky-600 text-white">Save Document</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
