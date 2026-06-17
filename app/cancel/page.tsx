import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EBEAE6] p-10 text-center shadow-lg">
        <XCircle className="w-16 h-16 text-[#8A8782] mx-auto mb-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Checkout Cancelled</h1>
        <p className="text-sm text-[#64625D] mt-3 leading-relaxed">
          No payment was taken. Your sofa configuration is saved — return to the configurator to continue where you left off.
        </p>
        <Link
          href="/configurator"
          className="inline-block mt-8 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-black transition-colors"
        >
          Return to Configurator
        </Link>
      </div>
    </div>
  );
}
