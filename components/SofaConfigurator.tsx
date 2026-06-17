'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Check, Info, Sliders, ShoppingBag, ShieldCheck, Truck, Sparkles,
} from 'lucide-react';
import { CheckoutModal } from '@/components/CheckoutModal';
import {
  BACK_DETAILS, CUSHION_DETAILS, FABRIC_DETAILS, MODEL_DETAILS,
  type BackStyle, type CushionType, type FabricQuality, type SofaModel,
} from '@/lib/sofa-data';
import { COLLECTION_CATEGORIES } from '@/lib/products/collection-catalog';
import { calculatePrice } from '@/lib/pricing';
import { useSofaStore } from '@/store/sofa-store';

function useCalculatedPrice() {
  const config = useSofaStore((state) => state.config);
  return useMemo(() => calculatePrice(config), [config]);
}

export default function SofaConfigurator() {
  const {
    config, isPriceBreakdownOpen, setModel, setFabricQuality,
    setFabricColor, setCushionType, setBackStyle, togglePriceBreakdown,
  } = useSofaStore();
  const prices = useCalculatedPrice();
  const [activeTab, setActiveTab] = useState<'frame' | 'fabric' | 'comfort'>('frame');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const threeSeater = COLLECTION_CATEGORIES[3];

  const selectedFabricData = FABRIC_DETAILS[config.fabricQuality];
  const activeColorObject = selectedFabricData.colors.find((c) => c.id === config.fabricColorId) || selectedFabricData.colors[0];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1B1A] font-sans antialiased selection:bg-[#E8E6E1]">
      <div className="bg-[#1C1B1A] text-white text-xs font-light tracking-[0.15em] text-center py-2 px-4 uppercase">
        Handcrafted bespoke builds. Delivered directly to space in 4-6 Weeks · 0% Interest Free Finance Available
      </div>

      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#EBEAE6] px-6 lg:px-12 py-4 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium text-[#64625D]">
          <Link href="/#story" className="hover:text-black transition-colors">Our Story</Link>
          <Link href="/configurator" className="text-black font-semibold underline underline-offset-4">Sofa Configurator</Link>
          <Link href="/#swatches" className="hover:text-black transition-colors">Swatches</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-mono text-[#64625D] hidden sm:inline">Status: Configurator Live</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-85px)]">
        <section className="lg:col-span-7 bg-[#F4F3EF] p-6 lg:p-12 flex flex-col justify-between relative border-r border-[#EBEAE6]">
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8A8782] font-mono">Active Render configuration</span>
              <h1 className="text-2xl font-normal tracking-tight text-black mt-0.5 capitalize">
                {MODEL_DETAILS[config.model].name}
              </h1>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-[#EBEAE6] rounded-lg p-3 text-right shadow-sm max-w-[180px] hidden sm:block">
              <span className="text-[10px] uppercase font-mono block text-[#8A8782]">Active Fabric</span>
              <span className="text-xs font-medium block truncate text-[#1C1B1A]">{activeColorObject.name}</span>
            </div>
          </div>

          <div className="my-auto py-12 flex flex-col items-center justify-center relative min-h-[350px]">
            <motion.div
              animate={{ backgroundColor: activeColorObject.hex }}
              transition={{ duration: 0.6 }}
              className="absolute w-[70%] h-[20%] rounded-full blur-[80px] opacity-20 bottom-1/3"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${config.model}-${config.fabricQuality}-${config.fabricColorId}-${config.backStyle}`}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full max-w-[560px] bg-white rounded-2xl border border-[#EBEAE6] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative z-10 flex flex-col items-center"
              >
                <div className="absolute top-4 right-4 bg-[#1C1B1A] text-white text-[9px] font-mono px-2 py-1 uppercase rounded tracking-widest">
                  {config.backStyle === 'high-back' ? 'High Backrest' : 'Standard'}
                </div>

                <svg className="w-48 h-48 mb-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    d="M15 55 C15 45, 85 45, 85 55 L80 75 L20 75 Z"
                    fill={activeColorObject.hex}
                    stroke="#1C1B1A"
                    strokeWidth="1.5"
                    className="transition-all duration-500"
                  />
                  <path
                    d={config.cushionType === 'feather-blend'
                      ? 'M22 62 Q50 67 78 62 L75 72 Q50 75 25 72 Z'
                      : 'M22 62 L78 62 L76 72 L24 72 Z'}
                    fill="#1C1B1A"
                    fillOpacity="0.15"
                    stroke="#1C1B1A"
                    strokeWidth="1"
                  />
                  <motion.rect
                    x="25"
                    y={config.backStyle === 'high-back' ? '20' : '32'}
                    width="50"
                    height={config.backStyle === 'high-back' ? '25' : '15'}
                    rx="4"
                    fill={activeColorObject.hex}
                    stroke="#1C1B1A"
                    strokeWidth="1.5"
                    className="transition-all duration-500"
                  />
                  <line x1="25" y1="75" x2="22" y2="84" stroke="#1C1B1A" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="75" y1="75" x2="78" y2="84" stroke="#1C1B1A" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                <div className="text-center">
                  <div className="text-[10px] font-mono text-[#8A8782] tracking-widest uppercase">Sofex Premium Collection</div>
                  <h3 className="text-lg font-medium text-black mt-0.5 capitalize">{config.model} Blueprint Frame</h3>
                  <p className="text-xs text-[#64625D] mt-2 max-w-sm line-clamp-2 px-4">{MODEL_DETAILS[config.model].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 bg-white/60 border border-[#EBEAE6] rounded-xl px-5 py-3 w-full max-w-[560px] backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#64625D] mb-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#1C1B1A]" />
                <span className="uppercase tracking-wider font-semibold">Live Dimensional Spec Footprint:</span>
              </div>
              <div className="text-xs text-[#1C1B1A] font-medium flex justify-between">
                <span>{threeSeater.label} configuration</span>
                <span className="font-mono text-[#64625D] font-bold">{threeSeater.dimensions}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EBEAE6] text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-[#64625D] mb-1" />
              <span className="text-[10px] font-medium tracking-wide uppercase">15 Year Frame Guarantee</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-[#64625D] mb-1" />
              <span className="text-[10px] font-medium tracking-wide uppercase">Premium Tracked Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-4 h-4 text-[#64625D] mb-1" />
              <span className="text-[10px] font-medium tracking-wide uppercase">Hand Spun Fabrics</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-5 bg-white flex flex-col justify-between">
          <div className="p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-185px)]">
            <div>
              <div className="text-xs font-mono text-[#8A8782] tracking-wider uppercase">Bespoke Design Suite</div>
              <h2 className="text-2xl font-light tracking-tight text-black mt-1">Configure Specifications</h2>
              <p className="text-xs text-[#64625D] mt-1">Tailor every layer of your furniture build to your specific interior architecture layout.</p>
            </div>

            <div className="flex border-b border-[#EBEAE6] bg-[#FBFBFA] p-1 rounded-lg">
              {(['frame', 'fabric', 'comfort'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-center py-2 text-[11px] font-medium tracking-wider uppercase rounded-md transition-all ${
                    activeTab === tab ? 'bg-white text-black shadow-sm font-semibold' : 'text-[#8A8782] hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                {activeTab === 'frame' && (
                  <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="space-y-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#64625D] flex justify-between">
                      <span>Select Base Silhouette Model</span>
                      <span>(4 Options Available)</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {(Object.keys(MODEL_DETAILS) as SofaModel[]).map((modelKey) => {
                        const item = MODEL_DETAILS[modelKey];
                        const isSelected = config.model === modelKey;
                        return (
                          <div
                            key={modelKey}
                            onClick={() => setModel(modelKey)}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between ${
                              isSelected ? 'border-black bg-black/[0.01] shadow-sm' : 'border-[#EBEAE6] hover:border-[#A8A49E]'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-black tracking-tight">{item.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                              </div>
                              <span className="text-[11px] block font-medium text-amber-800 tracking-wide">{item.tag}</span>
                              <p className="text-xs text-[#64625D] font-light max-w-sm">{item.desc}</p>
                            </div>
                            <span className="text-xs font-mono font-bold bg-[#F4F3EF] px-2 py-1 rounded">From £{item.basePrice}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'fabric' && (
                  <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#64625D] block">Select Fabric & Colour</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {(Object.keys(FABRIC_DETAILS) as FabricQuality[]).map((qualityKey) => {
                          const item = FABRIC_DETAILS[qualityKey];
                          const isSelected = config.fabricQuality === qualityKey;
                          return (
                            <div
                              key={qualityKey}
                              onClick={() => setFabricQuality(qualityKey)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                isSelected ? 'border-black bg-black/[0.01]' : 'border-[#EBEAE6] hover:border-[#A8A49E]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-black">{item.name}</span>
                                <span className="text-xs font-mono font-medium text-[#64625D]">Included</span>
                              </div>
                              <p className="text-[11px] text-[#64625D] font-light mt-0.5 leading-relaxed">{item.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#64625D] block">Colour Tone</label>
                        <span className="text-xs font-medium text-black bg-[#F4F3EF] px-2 py-0.5 rounded font-mono">{activeColorObject.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 p-3 bg-[#FBFBFA] border border-[#EBEAE6] rounded-xl">
                        {selectedFabricData.colors.map((color) => {
                          const isColorSelected = config.fabricColorId === color.id;
                          return (
                            <button
                              key={color.id}
                              onClick={() => setFabricColor(color.id)}
                              className="relative w-10 h-10 rounded-full border border-black/10 focus:outline-none group transition-transform active:scale-95"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            >
                              {isColorSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                  <Check className="w-4 h-4 text-white stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'comfort' && (
                  <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#64625D] block">Structural Backrest Profile Height</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(Object.keys(BACK_DETAILS) as BackStyle[]).map((styleKey) => {
                          const item = BACK_DETAILS[styleKey];
                          const isSelected = config.backStyle === styleKey;
                          return (
                            <div
                              key={styleKey}
                              onClick={() => setBackStyle(styleKey)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected ? 'border-black bg-black/[0.01]' : 'border-[#EBEAE6] hover:border-[#A8A49E]'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-semibold text-black block">{item.name}</span>
                                <p className="text-[11px] text-[#64625D] font-light mt-1 leading-snug">{item.desc}</p>
                              </div>
                              <span className="text-xs font-mono text-black font-bold mt-3 pt-2 border-t border-[#EBEAE6]/60">
                                {item.premium === 0 ? 'Standard Spec' : `+ £${item.premium}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#64625D] block">Internal Cushion Composition Wrap</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(Object.keys(CUSHION_DETAILS) as CushionType[]).map((cushionKey) => {
                          const item = CUSHION_DETAILS[cushionKey];
                          const isSelected = config.cushionType === cushionKey;
                          return (
                            <div
                              key={cushionKey}
                              onClick={() => setCushionType(cushionKey)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected ? 'border-black bg-black/[0.01]' : 'border-[#EBEAE6] hover:border-[#A8A49E]'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-semibold text-black block">{item.name}</span>
                                <p className="text-[11px] text-[#64625D] font-light mt-1 leading-snug">{item.desc}</p>
                              </div>
                              <span className="text-xs font-mono text-black font-bold mt-3 pt-2 border-t border-[#EBEAE6]/60">
                                {item.premium === 0 ? 'Standard Spec' : `+ £${item.premium}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-[#EBEAE6] shadow-[0_-10px_30px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 cursor-pointer select-none" onClick={togglePriceBreakdown}>
                <span className="text-xs text-[#64625D] font-medium hover:text-black transition-colors underline underline-offset-2">
                  View Transparent Pricing Breakdown
                </span>
                <Info className="w-3.5 h-3.5 text-[#8A8782]" />
              </div>
              <div className="text-right">
                <span className="text-[10px] block font-mono text-[#8A8782] uppercase leading-none">Total Investment</span>
                <span className="text-2xl font-semibold tracking-tight text-black">£{prices.total}</span>
              </div>
            </div>

            <AnimatePresence>
              {isPriceBreakdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#F4F3EF] rounded-xl p-3.5 text-xs font-mono text-[#64625D] space-y-2 overflow-hidden border border-[#EBEAE6]"
                >
                  <div className="flex justify-between">
                    <span>Base Frame Price:</span>
                    <span className="text-black font-medium">£{prices.baseFramePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cushion Filling Upgrade:</span>
                    <span className="text-black font-medium">+£{prices.cushionPremium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High-Back Upgrade:</span>
                    <span className="text-black font-medium">+£{prices.backPremium}</span>
                  </div>
                  <div className="border-t border-[#EBEAE6] pt-1.5 mt-1 flex justify-between font-bold text-black text-xs uppercase tracking-wider">
                    <span>Calculated Subtotal:</span>
                    <span>£{prices.total}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-[#1C1B1A] hover:bg-black text-white text-xs font-semibold uppercase tracking-widest py-4 px-6 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>Secure Handbuilt Custom Order</span>
            </button>

            <div className="text-center">
              <p className="text-[10px] text-[#8A8782] tracking-wide">
                Or spread interest-free payments from <span className="font-bold text-[#1C1B1A]">£{(prices.total / 12).toFixed(2)}/mo</span> for 12 months.
              </p>
            </div>
          </div>
        </section>
      </main>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} total={prices.total} />
    </div>
  );
}
