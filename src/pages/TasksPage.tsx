import React, { useState } from 'react';
import { Plus, Search, Loader2, Calendar, Clock, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useTasks, useCreateTask, useUpdateTask } from '../frontend/hooks/useTasks';

const TASK_STAGES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const;

const STAGE_LABELS: Record<string, string> = {
  'TODO': 'Todo',
  'IN_PROGRESS': 'In Progress',
  'REVIEW': 'Review',
  'DONE': 'Done'
};

export function TasksPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: ''
  });

  // Fetch tasks and mutations
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    createTaskMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
      }
    });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateTaskMutation.mutate({ id, data: { status: newStatus } });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Task Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize work, track deadlines, and collaborate.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] cursor-pointer">
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
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${view === 'kanban' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-white/50" />
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-400">Failed to load tasks from server</div>
      ) : view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 min-h-[500px]">
          <div className="flex gap-4 h-full min-w-max">
            {TASK_STAGES.map(stage => {
              const stageTasks = filteredTasks.filter(t => t.status === stage);
              return (
                <div key={stage} className="glass-card w-80 flex flex-col gap-3 rounded-2xl p-4 shrink-0 transition-all hover:bg-black/20">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="font-semibold text-sm tracking-wide text-white/80">{STAGE_LABELS[stage]}</h3>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/10">{stageTasks.length}</Badge>
                  </div>
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {stageTasks.map(task => (
                      <TaskCard key={task.id} task={task} onStatusChange={handleUpdateStatus} />
                    ))}
                    {stageTasks.length === 0 && (
                      <div className="p-8 text-center text-xs text-white/20 border border-dashed border-white/5 rounded-xl">
                        Vazifalar mavjud emas
                      </div>
                    )}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{task.title}</div>
                      <div className="text-xs text-white/50 mt-1 truncate max-w-xs">{task.description || 'Izoh yozilmagan'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-xs"
                        value={task.status}
                        onChange={e => handleUpdateStatus(task.id!, e.target.value)}
                      >
                        {TASK_STAGES.map(stage => (
                          <option key={stage} value={stage} className="bg-[#0a0a0a]">{STAGE_LABELS[stage]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                       <PriorityBadge priority={task.priority!} />
                    </td>
                    <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Belgilanmagan'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Yangi vazifa yaratish</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white rounded-full">✕</Button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium font-mono">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium font-mono">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full h-20 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-medium font-mono">Priority</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="LOW" className="bg-[#0a0a0a]">Low</option>
                    <option value="MEDIUM" className="bg-[#0a0a0a]">Medium</option>
                    <option value="HIGH" className="bg-[#0a0a0a]">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-medium font-mono">Due Date</label>
                  <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/5">Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={createTaskMutation.isPending} 
                  className="bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
                >
                  {createTaskMutation.isPending ? 'Saving...' : 'Create Task'}
                </Button>
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
    <span className={`px-2 py-0.5 rounded text-xs border ${colors[priority] || colors.MEDIUM}`}>
      {priority}
    </span>
  );
}

function TaskCard({ task, onStatusChange }: { task: any; onStatusChange: (id: string, newStatus: string) => void }) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/5 outline outline-1 outline-transparent hover:outline-white/20 hover:bg-black/60 transition-all cursor-pointer group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        <select 
          className="bg-transparent border border-white/10 rounded px-1.5 py-0.5 text-white/60 text-[10px] cursor-pointer hover:bg-white/5"
          value={task.status}
          onChange={e => onStatusChange(task.id!, e.target.value)}
        >
          {TASK_STAGES.map(stage => (
            <option key={stage} value={stage} className="bg-[#0a0a0a]">{STAGE_LABELS[stage]}</option>
          ))}
        </select>
      </div>
      
      <h4 className="font-semibold text-white text-sm group-hover:text-sky-300 transition-colors mb-1">{task.title}</h4>
      <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{task.description || 'Izoh yo\'q'}</p>
      
      <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-3">
        <div className="flex gap-2 items-center text-white/40">
           <Clock className="size-3" />
           <span className="text-[10px] font-mono">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Due: N/A'}</span>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
