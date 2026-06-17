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
      if (dbProduct) {
        const dbView = dbProductToView(dbProduct);
        const staticView = staticProductToView(staticProduct);
        product = {
          ...dbView,
          images: dbView.images.length > 0 ? dbView.images : staticView.images,
          collectionItems:
            dbView.collectionItems.length > 0 ? dbView.collectionItems : staticView.collectionItems,
          reviews: dbView.reviews.length > 0 ? dbView.reviews : staticView.reviews,
        };
      }
    } catch {
      // use static fallback
    }
  }

  return <ProductPageContent product={product} />;
}
