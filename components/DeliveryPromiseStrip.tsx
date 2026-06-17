import { Truck, MapPin, Wrench } from 'lucide-react';
import { DELIVERY_PROMISE } from '@/lib/configurator-catalog';

export function DeliveryPromiseStrip({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-[10px] sm:text-xs text-center text-[#64625D] tracking-wide">
        <span className="font-semibold text-[#1C1B1A]">{DELIVERY_PROMISE.headline}</span>
        {' · '}
        {DELIVERY_PROMISE.radius}
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="flex gap-3 items-start p-4 rounded-xl bg-white border border-[#EBEAE6]">
        <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-black">Within 7 days</p>
          <p className="text-[11px] text-[#64625D] mt-0.5">Custom-built sofa delivered fast — our key promise</p>
        </div>
      </div>
      <div className="flex gap-3 items-start p-4 rounded-xl bg-white border border-[#EBEAE6]">
        <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-black">50 miles of London</p>
          <p className="text-[11px] text-[#64625D] mt-0.5">White-glove delivery to your door across Greater London</p>
        </div>
      </div>
      <div className="flex gap-3 items-start p-4 rounded-xl bg-white border border-[#EBEAE6]">
        <Wrench className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-black">Assembled in your home</p>
          <p className="text-[11px] text-[#64625D] mt-0.5">{DELIVERY_PROMISE.assembly}</p>
        </div>
      </div>
    </div>
  );
}
