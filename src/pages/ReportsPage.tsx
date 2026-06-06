import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

const performanceData = [
  { name: 'Q1', revenue: 450000, target: 400000 },
  { name: 'Q2', revenue: 520000, target: 450000 },
  { name: 'Q3', revenue: 480000, target: 500000 },
  { name: 'Q4', revenue: 610000, target: 550000 },
];

export function ReportsPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Analytics & Reports</h1>
          <p className="text-white/60 mt-1 text-sm">Visualize business intelligence and export data.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
            <Calendar className="size-4 mr-2 text-white/60" />
            This Year
          </Button>
          <Button className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
            <Download className="size-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Revenue vs Target</CardTitle>
            <CardDescription className="text-white/50">Quarterly performance analysis.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Customer Acquisition</CardTitle>
            <CardDescription className="text-white/50">New users joining the platform.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorAcq)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-card border-white/10 backdrop-blur-md overflow-hidden">
         <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Generated Reports List</h3>
            <p className="text-sm text-white/50">Historical exports and automated system reports.</p>
         </div>
         <div className="p-0">
           <table className="w-full text-sm text-left">
             <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Monthly Financial Summary - Oct 2026', type: 'Finance', date: 'Oct 31, 2026' },
                  { name: 'Q3 Sales Performance Review', type: 'Sales', date: 'Oct 15, 2026' },
                  { name: 'Inventory Deficit Alert Log', type: 'Warehouse', date: 'Oct 12, 2026' },
                  { name: 'Employee Attendance Quarterly', type: 'HR', date: 'Oct 01, 2026' },
                ].map((rep, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                     <td className="px-6 py-4 font-medium text-white">{rep.name}</td>
                     <td className="px-6 py-4 text-white/50 font-mono text-xs">{rep.type}</td>
                     <td className="px-6 py-4 text-white/40 text-right">{rep.date}</td>
                     <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="ghost" className="text-indigo-400 hover:bg-indigo-500/10">Download</Button>
                     </td>
                  </tr>
                ))}
             </tbody>
           </table>
         </div>
      </Card>
    </div>
  );
}
