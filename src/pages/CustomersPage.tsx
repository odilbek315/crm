import React, { useState } from 'react';
import { Plus, Search, Loader2, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  useCustomers, 
  useCreateCustomer, 
  useUpdateCustomer, 
  useDeleteCustomer 
} from '../frontend/hooks/useCustomers';

export function CustomersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    status: 'Active',
    value: 0
  });

  // Fetch paginated customers from backend
  const { data: customersResponse, isLoading, error } = useCustomers(page);
  
  // CRUD mutations
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const handleOpenModal = (customer?: any) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        company: customer.company || '',
        status: customer.status,
        value: customer.value || 0
      });
    } else {
      setEditingCustomer(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', company: '', status: 'Active', value: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomerMutation.mutate({ 
        id: editingCustomer.id, 
        data: formData 
      }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingCustomer(null);
          resetForm();
        }
      });
    } else {
      createCustomerMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          resetForm();
        }
      });
    }
  };

  const customers = customersResponse?.data || [];
  const meta = customersResponse?.meta;

  // Filter customers matching the search query locally on the current page
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Customers</h1>
          <p className="text-white/60 mt-1 text-sm">Manage your active client base and segment profiles.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal()} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] cursor-pointer">
            <Plus className="size-4 mr-2" />
            New Customer
          </Button>
        </div>
      </div>

      <Card className="flex flex-col min-h-[500px] overflow-hidden glass-card border-white/10 backdrop-blur-md">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02]">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Search page customers..." 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table Content */}
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
               <Loader2 className="size-8 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load customers from server</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground uppercase bg-white/[0.01] border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium pl-6">Company/Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue</th>
                  <th className="px-6 py-4 font-medium text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-display font-bold text-xs border border-white/10">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{customer.name}</div>
                          <div className="text-xs text-white/50 mt-0.5">{customer.email} {customer.company && `• ${customer.company}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'} className="bg-opacity-10 shadow-none">
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      <span className="font-medium text-white">${(customer.value || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-8 cursor-pointer" onClick={() => handleOpenModal(customer)}>
                          <Edit className="size-4 text-white/60 hover:text-sky-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 cursor-pointer" onClick={() => {
                          if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
                            deleteCustomerMutation.mutate(customer.id!);
                          }
                        }}>
                          <Trash2 className="size-4 text-white/60 hover:text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filteredCustomers.length === 0 && (
            <div className="p-12 text-center text-white/40">
              No customers found on this page.
            </div>
          )}
        </div>

        {/* Server Pagination Footer */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="text-xs text-white/50">
              Showing page {meta.page} of {meta.totalPages} ({meta.totalItems} total customers)
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={meta.page <= 1} 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="text-white hover:bg-white/5 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={meta.page >= meta.totalPages} 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                className="text-white hover:bg-white/5 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* New/Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingCustomer ? 'Edit Customer' : 'New Customer'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium">Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium">Email</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium">Company</label>
                <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium">Status</label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active" className="bg-[#0a0a0a]">Active</option>
                  <option value="Inactive" className="bg-[#0a0a0a]">Inactive</option>
                  <option value="Lead" className="bg-[#0a0a0a]">Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium">Revenue Value ($)</label>
                <Input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/5">Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending} 
                  className="bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
                >
                  {(createCustomerMutation.isPending || updateCustomerMutation.isPending) ? 'Saving...' : 'Save Customer'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
export default CustomersPage;
