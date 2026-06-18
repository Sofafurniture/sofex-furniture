import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { ContactForm } from '@/components/ContactForm';
import { UserAuth } from '@/components/UserAuth';
import { BRAND_NAME, STORE_EMAIL } from '@/lib/brand';

export const metadata = {
  title: `Contact — ${BRAND_NAME}`,
  description: `Get in touch with ${BRAND_NAME}. Orders, delivery questions, and bespoke sofa enquiries.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1B1A]">
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#EBEAE6] px-6 lg:px-12 py-4 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium text-[#64625D]">
          <Link href="/#story" className="hover:text-black transition-colors">Our Story</Link>
          <Link href="/#collections" className="hover:text-black transition-colors">Collections</Link>
          <Link href="/configurator" className="hover:text-black transition-colors">Configurator</Link>
          <Link href="/contact" className="text-black font-semibold underline underline-offset-4">Contact</Link>
        </nav>
        <UserAuth compact />
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-12 py-16">
        <div className="max-w-xl mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8A8782] mb-3">Get in touch</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Contact us</h1>
          <p className="text-sm text-[#64625D] leading-relaxed">
            Questions about an order, delivery, or a bespoke build? Send us a message and our team will respond
            as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <aside className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#EBEAE6] bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">Contact details</h2>
              <ul className="space-y-4 text-sm text-[#64625D]">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-emerald-800" />
                  <a href={`mailto:${STORE_EMAIL}`} className="hover:text-black transition-colors">
                    {STORE_EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-800" />
                  <span>Delivering within 50 miles of London</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-emerald-800" />
                  <span>We reply to all enquiries by email</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#EBEAE6] bg-[#F4F3EF] p-6 text-sm text-[#64625D]">
              <p className="font-medium text-[#1C1B1A] mb-2">Order support</p>
              <p>
                For order updates, include your order reference if you have one. Paid orders also receive a
                confirmation email from us.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#1C1B1A] text-white py-12 mt-20">
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
