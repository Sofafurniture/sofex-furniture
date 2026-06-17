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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), product_reviews(*)')
      .eq('id', id)
      .single();

    if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = (await request.json()) as ProductFormData;
    const supabase = createServiceClient();

    const { error } = await supabase.from('products').update(formDataToDbPayload(body)).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await saveProductRelations(id, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update';
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const supabase = createServiceClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
