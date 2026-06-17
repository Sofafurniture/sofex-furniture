import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductPageContent } from '@/components/ProductPageContent';
import { BRAND_NAME } from '@/lib/brand';
import { fetchProductBySlug } from '@/lib/admin-db';
import { getStaticProduct, PRODUCT_SLUGS } from '@/lib/products';
import { dbProductToView, staticProductToView } from '@/lib/product-view';
import { isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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

  const staticView = staticProductToView(staticProduct);
  let product = staticView;

  if (isSupabaseConfigured) {
    try {
      const dbProduct = await fetchProductBySlug(slug);
      if (dbProduct) {
        const dbView = dbProductToView(dbProduct);
        const dbImages = dbView.images.filter((img) => img.src?.startsWith('http'));
        product = {
          ...dbView,
          // Always prefer high-quality static catalog photos until admin uploads real assets
          images: staticView.images.length > 0 ? staticView.images : dbImages,
          collectionItems: staticView.collectionItems.map((staticItem, index) => {
            const dbItem = dbView.collectionItems[index];
            return {
              ...(dbItem ?? staticItem),
              name: dbItem?.name ?? staticItem.name,
              price: dbItem?.price ?? staticItem.price,
              dimensions: dbItem?.dimensions ?? staticItem.dimensions,
              image: staticItem.image ?? dbItem?.image,
            };
          }),
          reviews: dbView.reviews.length > 0 ? dbView.reviews : staticView.reviews,
        };
      }
    } catch {
      // use static fallback
    }
  }

  return <ProductPageContent product={product} />;
}
