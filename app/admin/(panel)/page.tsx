import Link from 'next/link';
import { Package, ShoppingCart, Download, Plus } from 'lucide-react';
import { getAdminStats } from '@/lib/admin-db';
import { isSupabaseConfigured } from '@/lib/supabase';

export default async function AdminDashboardPage() {
  let stats = { productCount: 0, orderCount: 0, todayOrderCount: 0 };
  let dbReady = isSupabaseConfigured;

  if (dbReady) {
    try {
      stats = await getAdminStats();
    } catch {
      dbReady = false;
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#64625D] mt-1">Manage products, customers, and daily orders</p>
      </div>

      {!dbReady && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
          Supabase is not configured. Add your keys to <code className="font-mono">.env.local</code> and run the migrations in <code className="font-mono">supabase/migrations/</code>.
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6">
          <Package className="w-5 h-5 text-[#64625D] mb-3" />
          <p className="text-3xl font-semibold">{stats.productCount}</p>
          <p className="text-xs text-[#8A8782] uppercase tracking-wider mt-1">Products</p>
        </div>
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6">
          <ShoppingCart className="w-5 h-5 text-[#64625D] mb-3" />
          <p className="text-3xl font-semibold">{stats.orderCount}</p>
          <p className="text-xs text-[#8A8782] uppercase tracking-wider mt-1">Total Orders</p>
        </div>
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6">
          <Download className="w-5 h-5 text-[#64625D] mb-3" />
          <p className="text-3xl font-semibold">{stats.todayOrderCount}</p>
          <p className="text-xs text-[#8A8782] uppercase tracking-wider mt-1">Orders Today</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 bg-[#1C1B1A] text-white p-6 rounded-2xl hover:bg-black transition-colors"
        >
          <Plus className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Add New Product</p>
            <p className="text-xs text-white/60 mt-0.5">Images, description, reviews</p>
          </div>
        </Link>
        <a
          href={`/api/admin/orders/export?date=${today}`}
          className="flex items-center gap-3 bg-white border border-[#EBEAE6] p-6 rounded-2xl hover:border-black transition-colors"
        >
          <Download className="w-5 h-5 text-[#64625D]" />
          <div>
            <p className="font-semibold text-sm">Download Today&apos;s Orders</p>
            <p className="text-xs text-[#8A8782] mt-0.5">CSV with all customer details</p>
          </div>
        </a>
      </div>
    </div>
  );
}
