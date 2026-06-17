'use client';

import { useState } from 'react';
import Image from 'next/image';
import { shouldBypassImageOptimizer } from '@/lib/image-utils';

interface ProductGalleryProps {
  images: { src: string; alt: string }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-[#F4F3EF] rounded-2xl overflow-hidden border border-[#EBEAE6]">
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={activeIndex === 0}
          unoptimized={shouldBypassImageOptimizer(active.src)}
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              index === activeIndex ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="80px"
              loading="lazy"
              unoptimized={shouldBypassImageOptimizer(image.src)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
