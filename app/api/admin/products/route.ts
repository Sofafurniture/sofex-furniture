import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { createServiceClient } from '@/lib/supabase';
import { formDataToDbPayload, type ProductFormData } from '@/lib/admin-types';

async function saveProductRelations(productId: string, data: ProductFormData) {
  const supabase = createServiceClient();

  await supabase.from('product_images').delete().eq('product_id', productId);
  if (data.images.length > 0) {
    await supabase.from('product_images').insert(
      data.images.map((img, i) => ({
        product_id: productId,
        url: img.url,
        alt: img.alt || null,
        sort_order: i,
      })),
    );
  }

  await supabase.from('product_reviews').delete().eq('product_id', productId);
  if (data.reviews.length > 0) {
    await supabase.from('product_reviews').insert(
      data.reviews.map((r) => ({
        product_id: productId,
        author: r.author,
        title: r.title || null,
        body: r.body,
        rating: r.rating,
        image_urls: r.imageUrls.filter(Boolean),
      })),
    );
  }
}

export async function GET() {
  try {
    await requireAdminSession();
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), product_reviews(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = (await request.json()) as ProductFormData;
    const supabase = createServiceClient();

    const { data: product, error } = await supabase
      .from('products')
      .insert(formDataToDbPayload(body))
      .select('id')
      .single();

    if (error || !product) {
      return NextResponse.json({ error: error?.message ?? 'Failed to create product' }, { status: 400 });
    }

    await saveProductRelations(product.id, body);
    return NextResponse.json({ id: product.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 });
  }
}
