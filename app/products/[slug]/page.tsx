import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductPageContent } from '@/components/ProductPageContent';
import { BRAND_NAME } from '@/lib/brand';
import { fetchProductBySlug } from '@/lib/admin-db';
import { getStaticProduct, PRODUCT_SLUGS } from '@/lib/products';
import { dbProductToView, staticProductToView } from '@/lib/product-view';
import { isSupabaseConfigured } from '@/lib/supabase';

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const staticProduct = getStaticProduct(slug);
  if (!staticProduct) return { title: 'Product Not Found' };
  return {
    title: `${staticProduct.name} — ${staticProduct.colour} | ${BRAND_NAME}`,
    description: staticProduct.description.intro,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticProduct = getStaticProduct(slug);
  if (!staticProduct) notFound();

  let product = staticProductToView(staticProduct);

  if (isSupabaseConfigured) {
    try {
      const dbProduct = await fetchProductBySlug(slug);
      if (dbProduct) product = dbProductToView(dbProduct);
    } catch {
      // use static fallback
    }
  }

  return <ProductPageContent product={product} />;
}
