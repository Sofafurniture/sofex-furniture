import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, Star, Truck, Clock, MapPin, Wrench } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { DeliveryPromiseStrip } from '@/components/DeliveryPromiseStrip';
import { UserAuth } from '@/components/UserAuth';
import { BRAND_NAME, STORE_EMAIL } from '@/lib/brand';
import { DELIVERY_PROMISE } from '@/lib/configurator-catalog';
import { FABRIC_DETAILS, MODEL_DETAILS } from '@/lib/sofa-data';
import { PRODUCT_CATALOG, brooklynProduct } from '@/lib/products';
import { shouldBypassImageOptimizer } from '@/lib/image-utils';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1B1A]">
      <div className="bg-emerald-900 text-white text-xs font-medium tracking-wide text-center py-2.5 px-4">
        <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        {DELIVERY_PROMISE.headline} · {DELIVERY_PROMISE.radius}
      </div>

      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#EBEAE6] px-6 lg:px-12 py-4 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium text-[#64625D]">
          <a href="#story" className="hover:text-black transition-colors">Our Story</a>
          <a href="#collections" className="hover:text-black transition-colors">Collections</a>
          <Link href="/configurator" className="hover:text-black transition-colors">Configurator</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/configurator"
            className="bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-black transition-colors"
          >
            Design Yours
          </Link>
          <UserAuth compact />
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8782] mb-4">Bespoke Furniture by {BRAND_NAME}</p>
            <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black leading-[1.1]">
              Sofas built for how you actually live.
            </h1>
            <p className="text-base text-[#64625D] mt-6 max-w-lg leading-relaxed">
              Your custom sofa, handcrafted and delivered within <strong className="text-black">7 days</strong> — inside a 50-mile radius of London. We deliver the whole sofa and assemble it in your home. Never flat-packed.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/configurator"
                className="inline-flex items-center gap-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black transition-all"
              >
                Start Configuring
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#collections"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl border border-[#EBEAE6] hover:border-black transition-colors"
              >
                View Collections
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8E6E1] to-[#F4F3EF] rounded-3xl blur-2xl opacity-60" />
            <div className="relative bg-white border border-[#EBEAE6] rounded-3xl p-4 shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={brooklynProduct.images[0].src}
                  alt={brooklynProduct.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-xs font-mono text-[#8A8782] uppercase tracking-wider">The Brooklyn — 3 Seater Ivory</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-mono text-[#64625D]">4.9 · {brooklynProduct.reviewCount} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="bg-[#F4F3EF] border-y border-[#EBEAE6] py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8782]">Our Collections</p>
            <h2 className="text-3xl font-light tracking-tight mt-2">Four signature silhouettes</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.entries(MODEL_DETAILS) as [keyof typeof MODEL_DETAILS, typeof MODEL_DETAILS[keyof typeof MODEL_DETAILS]][]).map(([key, model]) => {
              const catalog = PRODUCT_CATALOG[key];
              return (
              <Link
                key={key}
                href={`/products/${key}`}
                className="bg-white rounded-2xl border border-[#EBEAE6] p-6 hover:border-black hover:shadow-lg transition-all group"
              >
                <div className="relative h-32 bg-[#FBFBFA] rounded-xl mb-4 overflow-hidden group-hover:bg-[#F4F3EF] transition-colors">
                  {catalog ? (
                    <Image
                      src={catalog.images[0].src}
                      alt={catalog.images[0].alt}
                      fill
                      className="object-cover"
                      sizes="300px"
                      loading="lazy"
                      unoptimized={shouldBypassImageOptimizer(catalog.images[0].src)}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <svg className="w-16 h-16" viewBox="0 0 100 60" fill="none">
                        <rect x="10" y="25" width="80" height="25" rx="4" fill="#E1D9C6" stroke="#1C1B1A" strokeWidth="1.5" />
                        <rect x="20" y="15" width="60" height="15" rx="3" fill="#E1D9C6" stroke="#1C1B1A" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold">{model.name}</h3>
                <p className="text-[11px] text-amber-800 font-medium mt-0.5">{model.tag}</p>
                <p className="text-xs text-[#64625D] mt-2 line-clamp-2">{model.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs font-mono font-bold">From £{catalog?.price ?? model.basePrice}</p>
                  {catalog && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="text-[10px] font-mono text-[#8A8782]">{catalog.averageRating}</span>
                    </div>
                  )}
                </div>
              </Link>
            );})}
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16 bg-white border-y border-[#EBEAE6]">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-800">Why Sofex</p>
            <h2 className="text-3xl font-light tracking-tight mt-2">London&apos;s fastest bespoke sofa delivery</h2>
          </div>
          <DeliveryPromiseStrip />
        </div>
      </section>

      <section id="story" className="py-20">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8782]">Our Story</p>
          <h2 className="text-3xl font-light tracking-tight mt-2 mb-6">Crafted, not manufactured</h2>
          <p className="text-[#64625D] leading-relaxed">
            {BRAND_NAME} was founded on a simple belief: your sofa should be as unique as your home. Every frame is built by hand in our workshop using sustainably sourced hardwood, premium upholstery fabrics, and time-honoured joinery techniques passed down through generations of British craftspeople.
          </p>
        </div>
      </section>

      <section id="swatches" className="bg-white border-y border-[#EBEAE6] py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8782]">Fabric Swatches</p>
            <h2 className="text-3xl font-light tracking-tight mt-2">Nine curated tones across three tiers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(FABRIC_DETAILS).map(([key, fabric]) => (
              <div key={key} className="border border-[#EBEAE6] rounded-2xl p-6">
                <h3 className="text-sm font-semibold">{fabric.name}</h3>
                <p className="text-xs text-[#64625D] mt-1 mb-4">{fabric.desc}</p>
                <div className="flex gap-3">
                  {fabric.colors.map((color) => (
                    <div key={color.id} className="text-center">
                      <div
                        className="w-12 h-12 rounded-full border border-black/10 mx-auto"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[10px] text-[#8A8782] mt-1 block">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-[#EBEAE6] bg-[#F4F3EF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid sm:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Clock className="w-5 h-5 text-emerald-800 mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">7-Day Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="w-5 h-5 text-emerald-800 mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">50 Miles of London</span>
          </div>
          <div className="flex flex-col items-center">
            <Wrench className="w-5 h-5 text-emerald-800 mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Assembled In Your Home</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-emerald-800 mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">15 Year Frame Guarantee</span>
          </div>
        </div>
      </section>

      <footer className="bg-[#1C1B1A] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <BrandLogo href="/" size="lg" />
            <p className="text-xs text-white/60 mt-1">Bespoke sofas, built to order.</p>
            <a href={`mailto:${STORE_EMAIL}`} className="text-xs text-white/50 mt-2 inline-block hover:text-white">
              {STORE_EMAIL}
            </a>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
