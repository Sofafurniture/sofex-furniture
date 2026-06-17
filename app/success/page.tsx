import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EBEAE6] p-10 text-center shadow-lg">
        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Order Confirmed</h1>
        <p className="text-sm text-[#64625D] mt-3 leading-relaxed">
          Thank you for your order. Your bespoke sofa is now in our production queue. We&apos;ll send a confirmation email with delivery details within 24 hours.
        </p>
        <p className="text-xs font-mono text-[#8A8782] mt-4">Estimated delivery: 4–6 weeks</p>
        <Link
          href="/"
          className="inline-block mt-8 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-black transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
