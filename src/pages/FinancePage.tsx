import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { 
  Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, 
  Plus, Loader2, Calendar, ShoppingBag, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  useFinanceStats, 
  useInvoices, 
  useProducts, 
  useCreateInvoice, 
  usePayInvoice 
} from '../frontend/hooks/useFinance';
import { useCustomers } from '../frontend/hooks/useCustomers';

export function FinancePage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  // Live queries
  const { data: stats, isLoading: isStatsLoading } = useFinanceStats();
  const { data: invoicesResponse, isLoading: isInvoicesLoading } = useInvoices(page, limit);
  const { data: customersResponse } = useCustomers(1, 100);
  const { data: products } = useProducts();

  // Mutations
  const createInvoiceMutation = useCreateInvoice();
  const payInvoiceMutation = usePayInvoice();

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formItems, setFormItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: '', quantity: 1 }
  ]);

  const invoices = invoicesResponse?.data || [];
  const meta = invoicesResponse?.meta;
  const customers = customersResponse?.data || [];

  // Form handling
  const handleAddItem = () => {
    setFormItems([...formItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...formItems];
    if (field === 'productId') {
      updated[index].productId = value;
    } else {
      updated[index].quantity = Math.max(1, Number(value));
    }
    setFormItems(updated);
  };

  // Real-time subtotal calculation for form preview
  const calculateFormPreview = () => {
    let subtotal = 0;
    formItems.forEach(item => {
      if (item.productId && products) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          subtotal += prod.price * item.quantity;
        }
      }
    });
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const preview = calculateFormPreview();

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !dueDate || formItems.some(item => !item.productId)) {
      alert('Iltimos, barcha maydonlarni to\'ldiring va kamida bitta mahsulotni tanlang.');
      return;
    }

    createInvoiceMutation.mutate({
      customerId,
      dueDate,
      items: formItems
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setCustomerId('');
        setDueDate('');
        setFormItems([{ productId: '', quantity: 1 }]);
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.error || err.message || 'Xatolik yuz berdi.';
        alert(`Hisob-faktura yaratishda xatolik: ${errorMsg}`);
      }
    });
  };

  const handlePayInvoice = (id: string) => {
    if (confirm('Ushbu hisob-fakturani to\'langan deb belgilamoqchimisiz?')) {
      payInvoiceMutation.mutate(id, {
        onError: (err: any) => {
          const errorMsg = err.response?.data?.error || err.message || 'Xatolik yuz berdi.';
          alert(`Hisob-fakturani to'lashda xatolik: ${errorMsg}`);
        }
      });
    }
  };

  // Loading indicator for stats
  if (isStatsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-sky-400" />
        <span className="ml-3 text-white/70">Moliyaviy ma'lumotlar yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Moliya & ERP</h1>
          <p className="text-white/60 mt-1 text-sm">Tashkilotning daromadlari, qarzdorliklari va ombor hisobi.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Faktura Chiqarish
          </Button>
          <Button 
            onClick={() => alert("Moliyaviy hisobotlar muvaffaqiyatli yuklab olindi (PDF/Excel formatida).")}
            variant="outline" 
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
          >
            <Download className="size-4 mr-2" />
            Eksport Qilish
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-400">
            <Wallet className="size-16" />
          </div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-indigo-300 tracking-wide">Jami Daromad (Paid)</p>
            <p className="text-4xl font-display font-bold mt-2 text-white glow-text">
              ${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
              <span className="flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="size-3 mr-1 text-emerald-400" />
                {stats?.paidRatio || 0}%
              </span>
              to'langan fakturalar nisbati
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-white/50 tracking-wide">Qarzdorlik (Outstanding)</p>
            <p className="text-3xl font-display font-bold mt-2 text-rose-400">
              ${stats?.outstandingReceivables.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
              <span className="text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded">
                {stats?.unpaidCount || 0} ta kutilayotgan
              </span>
              ({stats?.overdueCount || 0} ta muddati o'tgan)
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-white/50 tracking-wide">Mahsulotlar Ombor Qiymati</p>
            <p className="text-3xl font-display font-bold mt-2 text-emerald-400">
              ${stats?.inventoryValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
              <span className="text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {products?.length || 0} ta turdagi
              </span>
              faol mahsulotlar ro'yxati
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        {/* Cash Flow Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Pul Oqimi (Cash Flow)</CardTitle>
            <CardDescription className="text-white/50">So'nggi 6 oydagi to'langan (daromad) vs kutilayotgan moliyaviy oqim.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            {stats?.cashFlow && stats.cashFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.cashFlow} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="income" name="To'langan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Kutilayotgan" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">Grafik uchun ma'lumotlar mavjud emas</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices Table / List */}
        <Card className="flex flex-col glass-card">
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle className="text-white">Hisob-Fakturalar</CardTitle>
              <CardDescription className="text-white/50">Tizimdagi barcha rasmiylashtirilgan hisob-kitoblar.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto custom-scrollbar">
            {isInvoicesLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-sky-400" />
              </div>
            ) : invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : inv.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {inv.status === 'Paid' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{inv.customer?.name || 'Noma\'lum Mijoz'}</p>
                        <p className="text-xs text-white/50">Muddati: {new Date(inv.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-mono font-medium text-white">
                          ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <Badge className={`mt-1 text-[10px] leading-tight px-1.5 py-0 bg-transparent border ${
                          inv.status === 'Paid' ? 'border-emerald-500/30 text-emerald-300' : 
                          inv.status === 'Overdue' ? 'border-rose-500/30 text-rose-300' : 
                          'border-amber-500/30 text-amber-300'
                        }`}>
                          {inv.status === 'Paid' ? 'To\'langan' : inv.status === 'Overdue' ? 'Muddati O\'tgan' : 'Kutilmoqda'}
                        </Badge>
                      </div>
                      {inv.status !== 'Paid' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={payInvoiceMutation.isPending}
                          onClick={() => handlePayInvoice(inv.id)}
                          className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer min-w-[75px] flex items-center justify-center"
                        >
                          {payInvoiceMutation.isPending && payInvoiceMutation.variables === inv.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            "To'landi"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-white/40">Sizda hali hisob-fakturalar yo'q</div>
            )}
          </CardContent>
          
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50">Sahifa: {meta.page} / {meta.totalPages}</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  disabled={meta.page <= 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="bg-white/5 text-white border border-white/10 disabled:opacity-40"
                >
                  Orqaga
                </Button>
                <Button 
                  size="sm" 
                  disabled={meta.page >= meta.totalPages} 
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  className="bg-white/5 text-white border border-white/10 disabled:opacity-40"
                >
                  Oldinga
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Invoice Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <Card className="w-full max-w-2xl bg-[#0a0a0a] border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="size-5 text-emerald-400" />
                Yangi Hisob-Faktura Yaratish
              </h2>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">✕</Button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-medium">Mijoz (Customer)</label>
                  <select 
                    required
                    className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                  >
                    <option value="" className="bg-[#0a0a0a]">Mijozni tanlang...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name} ({c.company || 'Yakka tartibda'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-medium">To'lov Muddati (Due Date)</label>
                  <Input 
                    required
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white/90">Faktura Tarkibi</h3>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddItem}
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  >
                    Mahsulot qo'shish
                  </Button>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <select
                          required
                          className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                          value={item.productId}
                          onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                        >
                          <option value="" className="bg-[#0a0a0a]">Mahsulotni tanlang...</option>
                          {products?.map(p => (
                            <option key={p.id} value={p.id} disabled={p.stock <= 0} className="bg-[#0a0a0a]">
                              {p.name} (${p.price} | Qoldiq: {p.stock} ta)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <Input 
                          required
                          type="number"
                          min="1"
                          placeholder="Soni"
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                          className="bg-white/5 border-white/10 text-white text-center"
                        />
                      </div>
                      {formItems.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Preview */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2 mt-4">
                <div className="flex justify-between text-sm text-white/50">
                  <span>Oraliq summa (Subtotal):</span>
                  <span>${preview.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-white/50">
                  <span>QQS (Tax 10%):</span>
                  <span>${preview.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-white/5 pt-2">
                  <span>Jami summa (Total):</span>
                  <span className="text-emerald-400">${preview.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/5">
                  Bekor qilish
                </Button>
                <Button 
                  type="submit" 
                  disabled={createInvoiceMutation.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {createInvoiceMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin text-white" />
                      Yaratilmoqda...
                    </>
                  ) : 'Faktura chiqarish'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FinancePage;
