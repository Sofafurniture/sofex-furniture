'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2, Search } from 'lucide-react';
import type { Order } from '@/lib/admin-types';

interface OrdersPageClientProps {
  initialOrders: Order[];
}

export function OrdersPageClient({ initialOrders }: OrdersPageClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(initialOrders.length === 0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [exportDate, setExportDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    let cancelled = false;

    async function refreshOrders() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(res.status === 401 ? 'Session expired — please sign in again.' : 'Failed to load orders');
        }
        const data = (await res.json()) as Order[];
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load orders');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    refreshOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      o.shipping_address.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Orders & Customers</h1>
          <p className="text-sm text-[#64625D] mt-1">
            {loading ? 'Loading orders…' : `${orders.length} total orders — all customer details below`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={exportDate}
            onChange={(e) => setExportDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#EBEAE6] bg-white text-sm"
          />
          <a
            href={`/api/admin/orders/export?date=${exportDate}`}
            className="inline-flex items-center gap-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-black"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </a>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
          {loadError}
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8782]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, address or order ID..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#EBEAE6] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      {loading ? (
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-12 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#8A8782] mx-auto mb-3" />
          <p className="text-[#64625D]">Loading orders…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-12 text-center">
          <p className="text-[#64625D]">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-[#EBEAE6] rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-lg">{order.customer_name}</p>
                  <p className="text-sm text-[#64625D]">{order.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold font-mono">£{(order.total_pence / 100).toFixed(2)}</p>
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F4F3EF] text-[#8A8782]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#8A8782] mb-1">Delivery Address</p>
                  <p className="text-[#64625D] whitespace-pre-line">{order.shipping_address}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#8A8782] mb-1">Sofa Configuration</p>
                  <p className="text-[#64625D]">
                    {String((order.configuration as Record<string, string>).model ?? '')} · {String((order.configuration as Record<string, string>).size ?? '')} · {String((order.configuration as Record<string, string>).fabricQuality ?? '')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#EBEAE6] text-xs font-mono text-[#8A8782]">
                <span>Order: {order.id.slice(0, 8)}…</span>
                <span>{new Date(order.created_at).toLocaleString('en-GB')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
