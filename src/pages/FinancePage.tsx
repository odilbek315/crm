import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockTransactions } from '../data/mockData';

const cashFlowData = [
  { month: 'Jan', income: 150000, expense: 98000 },
  { month: 'Feb', income: 180000, expense: 120000 },
  { month: 'Mar', income: 160000, expense: 110000 },
  { month: 'Apr', income: 210000, expense: 95000 },
  { month: 'May', income: 230000, expense: 105000 },
  { month: 'Jun', income: 195000, expense: 130000 },
];

export function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Financial Overview</h1>
          <p className="text-white/60 mt-1 text-sm">Monitor revenue streams, expenses, and cash flow.</p>
        </div>
        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Download className="size-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-400">
            <Wallet className="size-16" />
          </div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-indigo-300 tracking-wide">Total Cash Balance</p>
            <p className="text-4xl font-display font-bold mt-2 text-white glow-text">$1,245,600</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
              <span className="flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="size-3 mr-1 text-emerald-400" />
                4.2%
              </span>
              vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-white/50 tracking-wide">Monthly Income</p>
            <p className="text-3xl font-display font-bold mt-2 text-white">$230,000</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
              <span className="flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="size-3 mr-1 text-emerald-400" />
                12.5%
              </span>
              vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-white/50 tracking-wide">Monthly Expenses</p>
            <p className="text-3xl font-display font-bold mt-2 text-white">$105,000</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
              <span className="flex items-center text-red-400 font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                <ArrowDownRight className="size-3 mr-1 text-red-400" />
                -2.1%
              </span>
              vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Cash Flow</CardTitle>
            <CardDescription className="text-white/50">Income vs Expenses over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col glass-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-white/50">Latest financial activities across all accounts.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto custom-scrollbar">
            <div className="space-y-4">
              {mockTransactions.slice(0, 8).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {tx.type === 'Income' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.category}</p>
                      <p className="text-xs text-white/50">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-medium ${tx.type === 'Income' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                    <Badge className={`mt-1 text-[10px] leading-tight px-1.5 py-0 bg-transparent border ${tx.status === 'Completed' ? 'border-emerald-500/30 text-emerald-300' : tx.status === 'Pending' ? 'border-amber-500/30 text-amber-300' : 'border-red-500/30 text-red-300'}`}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
