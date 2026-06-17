import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { fetchProductById } from '@/lib/admin-db';
import { productToFormData } from '@/lib/admin-types';
import { isSupabaseConfigured } from '@/lib/supabase';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    return (
      <div className="p-8">
        <p className="text-[#64625D]">Configure Supabase to edit products.</p>
      </div>
    );
  }

  const product = await fetchProductById(id);
  if (!product) notFound();

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight">Edit Product</h1>
        <p className="text-sm text-[#64625D] mt-1">{product.name}</p>
      </div>
      <ProductForm initial={productToFormData(product)} productId={id} />
    </div>
  );
}
