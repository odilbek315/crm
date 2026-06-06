import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Calendar, Clock, AlertCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const TASK_STAGES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

export function TasksPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: ''
  });

  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data.data as any[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/tasks', {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, form: typeof formData }) => api.patch(`/tasks/${data.id}`, {
      ...data.form,
      dueDate: data.form.dueDate ? new Date(data.form.dueDate).toISOString() : null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleOpenModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, form: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredTasks = tasks?.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Task Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize work, track deadlines, and collaborate.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
          <Plus className="size-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="glass-card flex rounded-lg p-1 ml-auto w-full sm:w-auto overflow-hidden">
          <button 
            onClick={() => setView('kanban')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'kanban' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-white/50" />
        </div>
      ) : error ? (
         <div className="p-12 text-center text-red-400">Failed to load tasks</div>
      ) : view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 min-h-[500px]">
          <div className="flex gap-4 h-full min-w-max">
            {TASK_STAGES.map(stage => {
              const stageTasks = filteredTasks.filter(t => t.status === stage);
              return (
                <div key={stage} className="glass-card w-80 flex flex-col gap-3 rounded-2xl p-4 shrink-0 transition-all hover:bg-black/20">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="font-semibold text-sm tracking-wide text-white/80">{stage.replace('_', ' ')}</h3>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/10">{stageTasks.length}</Badge>
                  </div>
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {stageTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={() => handleOpenModal(task)}
                        onDelete={() => deleteMutation.mutate(task.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden flex flex-col border-white/10 glass-card backdrop-blur-md">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/50 uppercase bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-medium">Task</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{task.title}</div>
                      <div className="text-xs text-white/50 mt-1 truncate max-w-xs">{task.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">{task.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                       <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="size-8" onClick={() => handleOpenModal(task)}>
                           <Edit className="size-4 text-muted-foreground hover:text-sky-400" />
                         </Button>
                         <Button variant="ghost" size="icon" className="size-8" onClick={() => deleteMutation.mutate(task.id)}>
                           <Trash2 className="size-4 text-muted-foreground hover:text-red-400" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Description</label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Status</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  {TASK_STAGES.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Priority</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  {['LOW', 'MEDIUM', 'HIGH'].map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Due Date</label>
                <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="bg-white/5 border-white/10" style={{colorScheme: 'dark'}} />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-sky-500 hover:bg-sky-600 text-white">Save Task</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    HIGH: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${colors[priority]}`}>
      {priority}
    </span>
  );
}

function TaskCard({ task, onEdit, onDelete }: { task: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/5 outline outline-1 outline-transparent hover:outline-white/20 hover:bg-black/60 transition-all group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="icon" className="size-6 shrink-0 text-white/50 hover:text-white" onClick={(e) => { e.preventDefault(); onEdit(); }}>
             <Edit className="size-3" />
           </Button>
           <Button variant="ghost" size="icon" className="size-6 shrink-0 text-white/50 hover:text-red-400" onClick={(e) => { e.preventDefault(); onDelete(); }}>
             <Trash2 className="size-3" />
           </Button>
        </div>
      </div>
      
      <h4 className="font-semibold text-white text-sm group-hover:text-sky-300 transition-colors mb-1">{task.title}</h4>
      <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-3">
        <div className="flex gap-2 items-center text-white/40">
           <Clock className="size-3" />
           <span className="text-[10px] font-mono">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
        </div>
      </div>
    </div>
  );
}
