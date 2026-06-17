'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from '@/components/BrandLogo';
import { UserAuth } from '@/components/UserAuth';
import {
  Check, Info, Sliders, ShoppingBag, ShieldCheck, Truck, Clock, MapPin,
} from 'lucide-react';
import { CheckoutModal } from '@/components/CheckoutModal';
import {
  BACK_DETAILS, CUSHION_DETAILS, FABRIC_DETAILS, MODEL_DETAILS,
  type BackStyle, type CushionType, type FabricQuality, type SofaModel,
} from '@/lib/sofa-data';
import {
  CONFIGURATOR_CATEGORIES,
  DELIVERY_PROMISE,
  getConfiguratorCategory,
  getConfiguratorImage,
  getModelPreviewImage,
} from '@/lib/configurator-catalog';
import { calculatePrice } from '@/lib/pricing';
import { shouldBypassImageOptimizer } from '@/lib/image-utils';
import { useSofaStore } from '@/store/sofa-store';

function useCalculatedPrice() {
  const config = useSofaStore((state) => state.config);
  return useMemo(() => calculatePrice(config), [config]);
}

export default function SofaConfigurator() {
  const {
    config, isPriceBreakdownOpen, setModel, setCategoryIndex,
    setFabricQuality, setFabricColor, setCushionType, setBackStyle, togglePriceBreakdown,
  } = useSofaStore();
  const prices = useCalculatedPrice();
  const [activeTab, setActiveTab] = useState<'frame' | 'fabric' | 'comfort'>('frame');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'seating' | 'corner' | 'footstool'>('all');

  const category = getConfiguratorCategory(config.categoryIndex);
  const previewImage = getConfiguratorImage(config.model, config.categoryIndex);
  const selectedFabricData = FABRIC_DETAILS[config.fabricQuality];
  const activeColorObject = selectedFabricData.colors.find((c) => c.id === config.fabricColorId) || selectedFabricData.colors[0];

  const filteredCategories = CONFIGURATOR_CATEGORIES.map((cat, index) => ({ cat, index })).filter(
    ({ cat }) => categoryFilter === 'all' || cat.group === categoryFilter,
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1B1A] font-sans antialiased selection:bg-[#E8E6E1]">
      <div className="bg-emerald-900 text-white text-xs font-medium tracking-wide text-center py-2.5 px-4">
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          {DELIVERY_PROMISE.headline}
          <span className="hidden sm:inline opacity-70">·</span>
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{DELIVERY_PROMISE.radius}</span>
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#EBEAE6] px-6 lg:px-12 py-4 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium text-[#64625D]">
          <Link href="/#delivery" className="hover:text-black transition-colors">Delivery</Link>
          <Link href="/configurator" className="text-black font-semibold underline underline-offset-4">Configurator</Link>
          <Link href="/#collections" className="hover:text-black transition-colors">Collections</Link>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hidden sm:inline">
            7-day delivery
          </span>
          <UserAuth compact />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-85px)]">
        <section className="lg:col-span-7 bg-[#F4F3EF] p-6 lg:p-12 flex flex-col justify-between relative border-r border-[#EBEAE6]">
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8A8782] font-mono">Your configuration</span>
              <h1 className="text-2xl font-normal tracking-tight text-black mt-0.5">
                {MODEL_DETAILS[config.model].name} · {category.label}
              </h1>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-[#EBEAE6] rounded-lg p-3 text-right shadow-sm max-w-[180px] hidden sm:block">
              <span className="text-[10px] uppercase font-mono block text-[#8A8782]">Fabric</span>
              <span className="text-xs font-medium block truncate">{activeColorObject.name}</span>
            </div>
          </div>

          <div className="my-auto py-8 flex flex-col items-center justify-center relative min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${config.model}-${config.categoryIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-[600px] bg-white rounded-2xl border border-[#EBEAE6] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10"
              >
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-[#1C1B1A] text-white text-[9px] font-mono px-2 py-1 uppercase rounded tracking-widest">
                    {config.backStyle === 'high-back' ? 'High back' : 'Standard'}
                  </span>
                </div>
                <div className="relative aspect-[4/3] bg-[#F4F3EF]">
                  <Image
                    src={previewImage}
                    alt={`${MODEL_DETAILS[config.model].name} ${category.label}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    unoptimized={shouldBypassImageOptimizer(previewImage)}
                  />
                </div>
                <div className="p-5 text-center border-t border-[#EBEAE6]">
                  <p className="text-[10px] font-mono text-[#8A8782] tracking-widest uppercase">Sofex Premium Collection</p>
                  <p className="text-sm font-medium text-black mt-1">{category.label}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 bg-white/80 border border-[#EBEAE6] rounded-xl px-5 py-3 w-full max-w-[600px]">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#64625D] mb-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-semibold">Dimensions</span>
              </div>
              <div className="text-xs flex justify-between gap-4">
                <span>{category.label}</span>
                <span className="font-mono text-[#64625D] font-bold shrink-0">{category.dimensions}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#EBEAE6]">
            {[
              { icon: Clock, label: '7-day delivery' },
              { icon: MapPin, label: '50mi London' },
              { icon: Truck, label: 'Whole sofa' },
              { icon: ShieldCheck, label: '15yr frame' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center p-2">
                <Icon className="w-4 h-4 text-emerald-800 mb-1" />
                <span className="text-[9px] font-medium tracking-wide uppercase text-[#64625D]">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white flex flex-col justify-between">
          <div className="p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-185px)]">
            <div>
              <h2 className="text-2xl font-light tracking-tight">Configure your sofa</h2>
              <p className="text-xs text-[#64625D] mt-1">Model, size, fabric and comfort — delivered assembled within a week.</p>
            </div>

            <div className="flex border-b border-[#EBEAE6] bg-[#FBFBFA] p-1 rounded-lg">
              {(['frame', 'fabric', 'comfort'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[11px] font-medium tracking-wider uppercase rounded-md ${
                    activeTab === tab ? 'bg-white text-black shadow-sm font-semibold' : 'text-[#8A8782]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'frame' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Model</div>
                  <div className="grid gap-2">
                    {(Object.keys(MODEL_DETAILS) as SofaModel[]).map((modelKey) => {
                      const item = MODEL_DETAILS[modelKey];
                      const isSelected = config.model === modelKey;
                      const thumb = getModelPreviewImage(modelKey);
                      return (
                        <button
                          type="button"
                          key={modelKey}
                          onClick={() => setModel(modelKey)}
                          className={`p-3 rounded-xl border text-left flex gap-3 items-center ${isSelected ? 'border-black ring-1 ring-black bg-[#FBFBFA]' : 'border-[#EBEAE6] hover:border-[#C8C6C0]'}`}
                        >
                          <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-[#F4F3EF] shrink-0">
                            <Image src={thumb} alt={item.name} fill className="object-cover" sizes="64px" unoptimized={shouldBypassImageOptimizer(thumb)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block">{item.name}</span>
                            <span className="text-[10px] block text-amber-800">{item.tag}</span>
                            <span className="text-[10px] font-mono text-[#8A8782]">from £{item.basePrice}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Size & category</span>
                    <div className="flex gap-1">
                      {(['seating', 'corner', 'footstool', 'all'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setCategoryFilter(f)}
                          className={`text-[9px] uppercase px-2 py-1 rounded-md ${
                            categoryFilter === f ? 'bg-[#1C1B1A] text-white' : 'bg-[#F4F3EF] text-[#64625D]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                    {filteredCategories.map(({ cat, index }) => {
                      const isSelected = config.categoryIndex === index;
                      const thumb = getConfiguratorImage(config.model, index);
                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setCategoryIndex(index)}
                          className={`rounded-xl border overflow-hidden text-left transition-all ${isSelected ? 'border-black ring-2 ring-black shadow-md' : 'border-[#EBEAE6] hover:border-[#C8C6C0]'}`}
                        >
                          <div className="relative h-24 bg-[#F4F3EF]">
                            <Image src={thumb} alt={cat.label} fill className="object-cover" sizes="200px" unoptimized={shouldBypassImageOptimizer(thumb)} />
                          </div>
                          <div className="p-2.5 flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[11px] font-semibold block leading-tight">{cat.label}</span>
                              <span className="text-[10px] font-mono text-[#64625D]">£{cat.price}</span>
                              <span className="text-[9px] text-[#8A8782] block mt-0.5">{cat.dimensions}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div className="space-y-6">
                {(Object.keys(FABRIC_DETAILS) as FabricQuality[]).map((qualityKey) => (
                  <button
                    type="button"
                    key={qualityKey}
                    onClick={() => setFabricQuality(qualityKey)}
                    className={`w-full p-3.5 rounded-xl border text-left ${config.fabricQuality === qualityKey ? 'border-black' : 'border-[#EBEAE6]'}`}
                  >
                    <span className="text-xs font-semibold">{FABRIC_DETAILS[qualityKey].name}</span>
                  </button>
                ))}
                <div className="flex flex-wrap gap-3 p-3 border border-[#EBEAE6] rounded-xl">
                  {selectedFabricData.colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFabricColor(color.id)}
                      className="w-10 h-10 rounded-full border border-black/10 relative"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {config.fabricColorId === color.id && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comfort' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-2">
                  {(Object.keys(BACK_DETAILS) as BackStyle[]).map((k) => (
                    <button key={k} type="button" onClick={() => setBackStyle(k)} className={`p-3 rounded-xl border text-left text-xs ${config.backStyle === k ? 'border-black' : 'border-[#EBEAE6]'}`}>
                      {BACK_DETAILS[k].name}
                    </button>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(Object.keys(CUSHION_DETAILS) as CushionType[]).map((k) => (
                    <button key={k} type="button" onClick={() => setCushionType(k)} className={`p-3 rounded-xl border text-left text-xs ${config.cushionType === k ? 'border-black' : 'border-[#EBEAE6]'}`}>
                      {CUSHION_DETAILS[k].name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#EBEAE6] space-y-4">
            <div className="flex justify-between items-center">
              <button type="button" onClick={togglePriceBreakdown} className="text-xs text-[#64625D] underline flex items-center gap-1">
                Price breakdown <Info className="w-3 h-3" />
              </button>
              <span className="text-2xl font-semibold">£{prices.total}</span>
            </div>
            {isPriceBreakdownOpen && (
              <div className="bg-[#F4F3EF] rounded-xl p-3 text-xs font-mono space-y-1">
                <div className="flex justify-between"><span>{category.label}</span><span>£{prices.baseFramePrice}</span></div>
                <div className="flex justify-between"><span>Cushions</span><span>+£{prices.cushionPremium}</span></div>
                <div className="flex justify-between"><span>Back</span><span>+£{prices.backPremium}</span></div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Choose delivery & checkout
            </button>
          </div>
        </section>
      </main>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} total={prices.total} />
    </div>
  );
}
