import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Briefcase, Mail, Calendar, TrendingUp, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function HRPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    status: 'Active'
  });

  const queryClient = useQueryClient();

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data.data as any[];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/employees', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, form: typeof formData }) => api.patch(`/employees/${data.id}`, data.form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEditingEmployee(null);
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const handleOpenModal = (emp?: any) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        name: emp.name,
        email: emp.email,
        department: emp.department || '',
        role: emp.role || '',
        status: emp.status || 'Active'
      });
    } else {
      setEditingEmployee(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '', role: '', status: 'Active' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, form: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredEmployees = employees?.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.department && e.department.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Human Resources</h1>
          <p className="text-white/60 mt-1 text-sm">Manage employee profiles, departments, and performance.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal()} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Plus className="size-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Employees', value: employees?.length || 0, icon: Briefcase, color: 'text-purple-400' },
          { title: 'Departments', value: new Set(employees?.map(e => e.department).filter(Boolean)).size, icon: Filter, color: 'text-indigo-400' },
          { title: 'Open Roles', value: '12', icon: Search, color: 'text-sky-400' },
          { title: 'Avg. Attendance', value: '96%', icon: Calendar, color: 'text-emerald-400' }
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-white/10 backdrop-blur-md hover:bg-white/5 transition-colors">
             <CardContent className="p-6">
               <div className="flex justify-between items-center mb-4">
                 <p className="text-sm font-medium text-white/50">{stat.title}</p>
                 <stat.icon className={`size-4 ${stat.color}`} />
               </div>
               <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
             </CardContent>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col min-h-[600px] overflow-hidden border-white/10 glass-card backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02]">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Search employees..." 
              className="pl-9 bg-black/40 border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="ml-auto border-white/10 bg-transparent text-white w-full sm:w-auto pointer-events-none">
            <Filter className="size-4 mr-2" />
            Filter Department
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-white/50" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load employees</div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-white/50 uppercase border-b border-white/10 bg-black/40 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-5 font-medium">Employee</th>
                  <th className="px-6 py-5 font-medium">Department</th>
                  <th className="px-6 py-5 font-medium">Status</th>
                  <th className="px-6 py-5 font-medium">Join Date</th>
                  <th className="px-6 py-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/[0.05] transition-colors group">
                    <td className="px-6 py-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-display font-bold text-white shadow-inner border border-white/10">
                          {employee.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-purple-300 transition-colors">{employee.name}</div>
                          <div className="text-xs text-white/50 flex items-center mt-1">
                            <Briefcase className="size-3 mr-1 opacity-70" /> {employee.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">{employee.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={employee.status === 'Active' ? 'success' : 'secondary'} className="bg-opacity-10 text-emerald-400 border border-emerald-400/20">
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-white/50 font-mono text-xs">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="size-8" onClick={() => handleOpenModal(employee)}>
                           <Edit className="size-4 text-muted-foreground hover:text-sky-400" />
                         </Button>
                         <Button variant="ghost" size="icon" className="size-8" onClick={() => deleteMutation.mutate(employee.id)}>
                           <Trash2 className="size-4 text-muted-foreground hover:text-red-400" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="p-12 text-center text-white/50">
                No employees found matching criteria.
              </div>
            )}
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingEmployee ? 'Edit Employee' : 'New Employee'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Email</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Department</label>
                <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Role / Position</label>
                <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Status</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  {['Active', 'On Leave', 'Terminated'].map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-purple-500 hover:bg-purple-600 text-white">Save Employee</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
