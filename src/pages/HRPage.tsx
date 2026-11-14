import React, { useState } from 'react';
import { Plus, Search, Filter, Loader2, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useEmployees } from '../frontend/hooks/useEmployees';

export function HRPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch employees
  const { data: employees = [], isLoading, error } = useEmployees();

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Human Resources</h1>
          <p className="text-white/60 mt-1 text-sm">Manage employee profiles, departments, and performance.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => alert("Xodim qo'shish funksiyasi ma'lumotlar bazasi boshqaruvi orqali amalga oshiriladi.")} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer">
            <Plus className="size-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Employees', value: String(employees.length), icon: Briefcase, color: 'text-purple-400' },
          { title: 'Departments', value: '4', icon: Filter, color: 'text-indigo-400' },
          { title: 'Open Roles', value: '3', icon: Search, color: 'text-sky-400' },
          { title: 'Avg. Attendance', value: '98%', icon: Calendar, color: 'text-emerald-400' }
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
        </div>
        
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load employees from server</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-white/50 uppercase border-b border-white/10 bg-black/40 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-5 font-medium">Employee</th>
                  <th className="px-6 py-5 font-medium">Department</th>
                  <th className="px-6 py-5 font-medium">Role</th>
                  <th className="px-6 py-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/[0.05] transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-display font-bold text-white shadow-inner border border-white/10">
                          {employee.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-purple-300 transition-colors">{employee.name}</div>
                          <div className="text-xs text-white/50 flex items-center mt-1">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">{employee.department || 'Bo\'limsiz'}</span>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {employee.role || 'Xodim'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={employee.status === 'Active' ? 'success' : 'secondary'} className="bg-opacity-10 text-emerald-400 border border-emerald-400/20">
                        {employee.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filteredEmployees.length === 0 && (
            <div className="p-12 text-center text-white/50">
              No employees found matching criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default HRPage;
