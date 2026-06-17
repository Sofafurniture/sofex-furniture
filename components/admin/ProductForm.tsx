'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import type { ProductFormData } from '@/lib/admin-types';

const emptyForm: ProductFormData = {
  slug: '',
  name: '',
  colour: '',
  price: 0,
  monthlyPrice: 0,
  sku: '',
  descriptionIntro: '',
  descriptionSections: [{ heading: '', body: '' }],
  highlights: [''],
  specs: [{ label: '', value: '' }],
  careInstructions: [''],
  deliveryOptions: [{ service: '', cost: '', timeframe: '' }],
  collectionItems: [{ name: '', price: 0 }],
  published: false,
  images: [],
  reviews: [],
};

interface ProductFormProps {
  initial?: ProductFormData;
  productId?: string;
}

export function ProductForm({ initial, productId }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(initial ?? emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return res.ok ? data.url : null;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) {
        update('images', [...form.images, { url, alt: file.name }]);
      }
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleReviewImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      const reviews = [...form.reviews];
      reviews[index] = { ...reviews[index], imageUrls: [...reviews[index].imageUrls, url] };
      update('reviews', reviews);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
    const method = productId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Failed to save');
      setSaving(false);
      return;
    }

    router.push('/admin/products');
    router.refresh();
  }

  const inputClass = 'mt-1 w-full px-4 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10';
  const labelClass = 'text-xs font-mono uppercase tracking-wider text-[#64625D]';

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">{error}</p>}

      <section className="bg-white border border-[#EBEAE6] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Product Name</span>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>URL Slug</span>
            <input required value={form.slug} onChange={(e) => update('slug', e.target.value)} className={inputClass} placeholder="brooklyn-3-seater" />
          </label>
          <label className="block">
            <span className={labelClass}>Colour</span>
            <input value={form.colour} onChange={(e) => update('colour', e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>SKU</span>
            <input value={form.sku} onChange={(e) => update('sku', e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Price (£)</span>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', parseFloat(e.target.value) || 0)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Monthly Price (£)</span>
            <input type="number" min="0" step="0.01" value={form.monthlyPrice} onChange={(e) => update('monthlyPrice', parseFloat(e.target.value) || 0)} className={inputClass} />
          </label>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="rounded" />
          <span className="text-sm font-medium">Published (visible on storefront)</span>
        </label>
      </section>

      <section className="bg-white border border-[#EBEAE6] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Product Images</h2>
          <label className="inline-flex items-center gap-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer hover:bg-black">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {form.images.map((img, i) => (
            <div key={i} className="relative group border border-[#EBEAE6] rounded-xl overflow-hidden">
              <div className="relative aspect-square">
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="150px" />
              </div>
              <input
                value={img.alt}
                onChange={(e) => {
                  const images = [...form.images];
                  images[i] = { ...images[i], alt: e.target.value };
                  update('images', images);
                }}
                placeholder="Alt text"
                className="w-full px-2 py-1.5 text-xs border-t border-[#EBEAE6]"
              />
              <button
                type="button"
                onClick={() => update('images', form.images.filter((_, j) => j !== i))}
                className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <label className="block">
          <span className={labelClass}>Or paste image URL</span>
          <div className="flex gap-2 mt-1">
            <input id="img-url" className={inputClass + ' mt-0'} placeholder="https://..." />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('img-url') as HTMLInputElement;
                if (input.value) {
                  update('images', [...form.images, { url: input.value, alt: '' }]);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-[#F4F3EF] rounded-xl text-xs font-semibold shrink-0"
            >
              Add
            </button>
          </div>
        </label>
      </section>

      <section className="bg-white border border-[#EBEAE6] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Description</h2>
        <label className="block">
          <span className={labelClass}>Intro</span>
          <textarea rows={3} value={form.descriptionIntro} onChange={(e) => update('descriptionIntro', e.target.value)} className={inputClass + ' resize-none'} />
        </label>
        {form.descriptionSections.map((section, i) => (
          <div key={i} className="border border-[#EBEAE6] rounded-xl p-4 space-y-3">
            <input value={section.heading} onChange={(e) => {
              const s = [...form.descriptionSections];
              s[i] = { ...s[i], heading: e.target.value };
              update('descriptionSections', s);
            }} placeholder="Section heading" className={inputClass + ' mt-0'} />
            <textarea value={section.body} onChange={(e) => {
              const s = [...form.descriptionSections];
              s[i] = { ...s[i], body: e.target.value };
              update('descriptionSections', s);
            }} rows={3} placeholder="Section body" className={inputClass + ' mt-0 resize-none'} />
            <button type="button" onClick={() => update('descriptionSections', form.descriptionSections.filter((_, j) => j !== i))} className="text-xs text-red-600 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Remove section
            </button>
          </div>
        ))}
        <button type="button" onClick={() => update('descriptionSections', [...form.descriptionSections, { heading: '', body: '' }])} className="text-xs font-semibold flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add section
        </button>
      </section>

      <section className="bg-white border border-[#EBEAE6] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Specs & Highlights</h2>
        {form.highlights.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input value={h} onChange={(e) => {
              const arr = [...form.highlights];
              arr[i] = e.target.value;
              update('highlights', arr);
            }} placeholder="Highlight" className={inputClass + ' mt-0 flex-1'} />
            <button type="button" onClick={() => update('highlights', form.highlights.filter((_, j) => j !== i))} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => update('highlights', [...form.highlights, ''])} className="text-xs font-semibold flex items-center gap-1"><Plus className="w-3 h-3" /> Add highlight</button>

        <div className="pt-4 border-t border-[#EBEAE6] space-y-3">
          <p className={labelClass}>Specifications</p>
          {form.specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input value={spec.label} onChange={(e) => {
                const arr = [...form.specs];
                arr[i] = { ...arr[i], label: e.target.value };
                update('specs', arr);
              }} placeholder="Label" className={inputClass + ' mt-0 flex-1'} />
              <input value={spec.value} onChange={(e) => {
                const arr = [...form.specs];
                arr[i] = { ...arr[i], value: e.target.value };
                update('specs', arr);
              }} placeholder="Value" className={inputClass + ' mt-0 flex-1'} />
              <button type="button" onClick={() => update('specs', form.specs.filter((_, j) => j !== i))} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => update('specs', [...form.specs, { label: '', value: '' }])} className="text-xs font-semibold flex items-center gap-1"><Plus className="w-3 h-3" /> Add spec</button>
        </div>
      </section>

      <section className="bg-white border border-[#EBEAE6] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customer Reviews</h2>
          <button
            type="button"
            onClick={() => update('reviews', [...form.reviews, { author: '', title: '', body: '', rating: 5, imageUrls: [] }])}
            className="text-xs font-semibold flex items-center gap-1 bg-[#F4F3EF] px-3 py-2 rounded-lg"
          >
            <Plus className="w-3 h-3" /> Add review
          </button>
        </div>

        {form.reviews.map((review, i) => (
          <div key={i} className="border border-[#EBEAE6] rounded-xl p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={review.author} onChange={(e) => {
                const r = [...form.reviews];
                r[i] = { ...r[i], author: e.target.value };
                update('reviews', r);
              }} placeholder="Customer name" className={inputClass + ' mt-0'} />
              <select value={review.rating} onChange={(e) => {
                const r = [...form.reviews];
                r[i] = { ...r[i], rating: parseInt(e.target.value) };
                update('reviews', r);
              }} className={inputClass + ' mt-0'}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </div>
            <input value={review.title} onChange={(e) => {
              const r = [...form.reviews];
              r[i] = { ...r[i], title: e.target.value };
              update('reviews', r);
            }} placeholder="Review title" className={inputClass + ' mt-0'} />
            <textarea value={review.body} onChange={(e) => {
              const r = [...form.reviews];
              r[i] = { ...r[i], body: e.target.value };
              update('reviews', r);
            }} rows={3} placeholder="Review text" className={inputClass + ' mt-0 resize-none'} />

            <div>
              <p className={labelClass + ' mb-2'}>Review images</p>
              <div className="flex flex-wrap gap-2">
                {review.imageUrls.map((url, j) => (
                  <div key={j} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#EBEAE6]">
                    <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                    <button type="button" onClick={() => {
                      const r = [...form.reviews];
                      r[i] = { ...r[i], imageUrls: r[i].imageUrls.filter((_, k) => k !== j) };
                      update('reviews', r);
                    }} className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full"><X className="w-2.5 h-2.5" /></button>
                  </div>
                ))}
                <label className="w-16 h-16 border border-dashed border-[#EBEAE6] rounded-lg flex items-center justify-center cursor-pointer hover:border-black">
                  <Upload className="w-4 h-4 text-[#8A8782]" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReviewImageUpload(i, e)} />
                </label>
              </div>
            </div>

            <button type="button" onClick={() => update('reviews', form.reviews.filter((_, j) => j !== i))} className="text-xs text-red-600 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Remove review
            </button>
          </div>
        ))}
      </section>

      <div className="flex gap-4">
        <button type="submit" disabled={saving || uploading} className="bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black disabled:opacity-60 flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {productId ? 'Save Changes' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl border border-[#EBEAE6]">
          Cancel
        </button>
      </div>
    </form>
  );
}
