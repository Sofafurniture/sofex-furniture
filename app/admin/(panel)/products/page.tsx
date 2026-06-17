import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { fetchAllProducts } from '@/lib/admin-db';
import { isSupabaseConfigured } from '@/lib/supabase';

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof fetchAllProducts>> = [];

  if (isSupabaseConfigured) {
    try {
      products = await fetchAllProducts();
    } catch {
      products = [];
    }
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Products</h1>
          <p className="text-sm text-[#64625D] mt-1">Manage sofas, images, descriptions and reviews</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-black"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-12 text-center">
          <p className="text-[#64625D]">No products yet. Add your first product or run the Supabase migration.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#EBEAE6] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FBFBFA] border-b border-[#EBEAE6]">
              <tr>
                <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-wider text-[#8A8782]">Product</th>
                <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-wider text-[#8A8782]">Price</th>
                <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-wider text-[#8A8782]">Reviews</th>
                <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-wider text-[#8A8782]">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const thumb = product.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0];
                return (
                  <tr key={product.id} className="border-b border-[#EBEAE6] last:border-0 hover:bg-[#FBFBFA]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F4F3EF] shrink-0">
                          {thumb && <Image src={thumb.url} alt="" fill className="object-cover" sizes="48px" />}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-[#8A8782] font-mono">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">£{(product.price_pence / 100).toFixed(2)}</td>
                    <td className="px-6 py-4">{product.product_reviews?.length ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F4F3EF] text-[#8A8782]'}`}>
                        {product.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/products/${product.id}`} className="inline-flex items-center gap-1 text-xs font-semibold hover:underline">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
