import React, { useState } from 'react';
import { PackageSearch, Plus, ArrowUpDown, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useProducts } from '../frontend/hooks/useProducts';

export function WarehousePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from database
  const { data: products = [], isLoading, error } = useProducts();

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockAlerts = products.filter(p => p.stock <= 5 || p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Warehouse Management</h1>
          <p className="text-white/60 mt-1 text-sm">Track inventory across all fulfillment centers.</p>
        </div>
        <Button onClick={() => alert("Mahsulot qo'shish funksiyasi moliya bo'limida yangi faktura yaratish yoki baza orqali amalga oshiriladi.")} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] cursor-pointer">
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white/50 tracking-wide">Total Stock Value</p>
                <p className="text-3xl font-display font-bold mt-2 text-white glow-text">${totalStockValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-sky-500/10 rounded-lg">
                <Tag className="size-5 text-sky-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white/50 tracking-wide">Low Stock Alerts</p>
                <div className="flex items-end gap-3 mt-2">
                  <p className="text-3xl font-display font-bold text-amber-400 glow-text">
                    {lowStockAlerts}
                  </p>
                  <p className="text-sm text-white/50 mb-1">items</p>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="size-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white/50 tracking-wide">Unique SKUs</p>
                <p className="text-3xl font-display font-bold mt-2 text-white glow-text">{products.length}</p>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-lg">
                <PackageSearch className="size-5 text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card flex flex-col min-h-[500px] overflow-hidden border-white/10 backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex gap-4 bg-white/[0.02]">
          <div className="relative w-full max-w-sm">
            <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Search products or SKUs..." 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load warehouse inventory from server</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground uppercase border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Product / SKU</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-right">Stock</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-xs font-mono text-muted-foreground mt-0.5">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-right font-mono">
                      <span className={
                        product.stock === 0 ? 'text-rose-400' : 
                        product.stock < 10 ? 'text-amber-400' : 'text-foreground'
                      }>
                        {product.stock.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        product.stock > 10 ? 'success' : 
                        product.stock > 0 ? 'warning' : 'destructive'
                      } className="bg-opacity-10 shadow-none border border-transparent">
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                      ${product.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="p-12 text-center text-white/50">
              No products found matching criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default WarehousePage;
