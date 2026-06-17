import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, ShoppingBag, Star, Truck } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { UserAuth } from '@/components/UserAuth';
import { BRAND_NAME } from '@/lib/brand';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductReviews } from '@/components/ProductReviews';
import { shouldBypassImageOptimizer } from '@/lib/image-utils';
import type { ProductView } from '@/lib/product-view';

interface ProductPageContentProps {
  product: ProductView;
}

export function ProductPageContent({ product }: ProductPageContentProps) {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1B1A]">
      <div className="bg-[#1C1B1A] text-white text-xs font-light tracking-[0.15em] text-center py-2 px-4 uppercase">
        Handcrafted bespoke builds · Delivered in 4-6 Weeks · 0% Interest Free Finance
      </div>

      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#EBEAE6] px-6 lg:px-12 py-4 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium text-[#64625D]">
          <Link href="/#story" className="hover:text-black transition-colors">Our Story</Link>
          <Link href={`/products/${product.slug}`} className="text-black font-semibold underline underline-offset-4 capitalize">{product.slug}</Link>
          <Link href="/configurator" className="hover:text-black transition-colors">Configurator</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/configurator"
            className="bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-black transition-colors"
          >
            Customise
          </Link>
          <UserAuth compact />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <nav className="text-xs font-mono text-[#8A8782] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#collections" className="hover:text-black">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ProductGallery images={product.images} />

          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8782]">The {product.name.split(' ')[1]} Collection</p>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight mt-2">
              {product.name}{product.colour ? ` — ${product.colour}` : ''}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-sm text-[#64625D]">{product.reviewCount.toLocaleString()} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">£{product.price}</span>
              {product.monthlyPrice > 0 && (
                <span className="text-sm text-[#64625D]">or from £{product.monthlyPrice}/mo interest-free</span>
              )}
            </div>

            <p className="text-sm text-emerald-700 font-medium mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              In Stock — select your delivery day at checkout
            </p>

            <p className="text-sm text-[#64625D] mt-6 leading-relaxed">{product.description.intro}</p>

            <ul className="mt-6 space-y-2">
              {product.description.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#1C1B1A]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/configurator"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-black transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Configure & Order
              </Link>
              <Link
                href="/configurator"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#EBEAE6] text-xs font-semibold uppercase tracking-widest py-4 px-6 rounded-xl hover:border-black transition-colors"
              >
                Customise Fabric
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-800 shrink-0" />
              <p className="text-xs text-emerald-900">
                Delivered within 7 days inside our 50-mile London radius — whole sofa, assembled in your home.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-20 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-light tracking-tight mb-6">Description</h2>
            <div className="space-y-6">
              {product.description.sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-sm font-semibold">{section.heading}</h3>
                  <p className="text-sm text-[#64625D] mt-2 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-light tracking-tight mb-6">Details & Dimensions</h2>
            <div className="border border-[#EBEAE6] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FBFBFA]'}>
                      <td className="px-4 py-3 font-medium text-[#64625D] w-2/5 border-b border-[#EBEAE6]">{spec.label}</td>
                      <td className="px-4 py-3 border-b border-[#EBEAE6]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-light tracking-tight mb-6">Delivery</h2>
            <div className="space-y-3">
              {product.delivery.map((option) => (
                <div key={option.service} className="flex justify-between items-center p-4 bg-white border border-[#EBEAE6] rounded-xl text-sm">
                  <div>
                    <p className="font-medium">{option.service}</p>
                    <p className="text-xs text-[#8A8782] mt-0.5">{option.timeframe}</p>
                  </div>
                  <span className="font-mono font-semibold">{option.cost}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-light tracking-tight mb-6">Care Instructions</h2>
            <ul className="space-y-3">
              {product.careInstructions.map((instruction) => (
                <li key={instruction} className="text-sm text-[#64625D] leading-relaxed pl-4 border-l-2 border-[#EBEAE6]">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {product.collectionItems.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-light tracking-tight mb-6">Complete the {product.name.split(' ')[1]} Set</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.collectionItems.map((item) => {
                const imageSrc = item.image ?? product.images[0]?.src;
                return (
                <div key={item.name} className="bg-white border border-[#EBEAE6] rounded-xl p-4 hover:border-black transition-colors">
                  <div className="relative h-24 bg-[#F4F3EF] rounded-lg mb-3 overflow-hidden">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="200px"
                        loading="lazy"
                        unoptimized={shouldBypassImageOptimizer(imageSrc)}
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium">{item.name}</p>
                  {item.dimensions && (
                    <p className="text-[10px] text-[#8A8782] mt-0.5">{item.dimensions}</p>
                  )}
                  <p className="text-xs font-mono font-bold mt-1">£{item.price}</p>
                </div>
              )})}
            </div>
          </section>
        )}

        <div className="mt-20">
          <ProductReviews
            reviews={product.reviews}
            reviewCount={product.reviewCount}
            averageRating={product.averageRating}
            ratingBreakdown={product.ratingBreakdown}
          />
        </div>
      </main>

      <footer className="bg-[#1C1B1A] text-white py-12 mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <BrandLogo href="/" size="lg" />
            <p className="text-xs text-white/60 mt-1">Bespoke sofas, built to order.</p>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
