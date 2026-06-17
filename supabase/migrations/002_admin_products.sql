-- Products, images, reviews, and storage for admin CMS

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  colour text,
  price_pence integer not null default 0,
  monthly_price_pence integer,
  sku text,
  description_intro text,
  description_sections jsonb not null default '[]'::jsonb,
  highlights text[] not null default '{}',
  specs jsonb not null default '[]'::jsonb,
  care_instructions text[] not null default '{}',
  delivery_options jsonb not null default '[]'::jsonb,
  collection_items jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author text not null,
  title text,
  body text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);
create index if not exists product_reviews_product_idx on public.product_reviews (product_id);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_published_idx on public.products (published);

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_reviews enable row level security;

-- Public can read published products only (via anon key on storefront)
create policy "Public read published products"
  on public.products for select
  to anon, authenticated
  using (published = true);

create policy "Public read product images"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.published = true
    )
  );

create policy "Public read product reviews"
  on public.product_reviews for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.published = true
    )
  );

-- No public writes on CMS tables (admin uses service role server-side)

-- Storage bucket for product & review images
insert into storage.buckets (id, name, public)
values ('product-assets', 'product-assets', true)
on conflict (id) do nothing;

create policy "Public read product assets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-assets');

-- Seed Brooklyn product from reference data
insert into public.products (
  slug, name, colour, price_pence, monthly_price_pence, sku,
  description_intro, description_sections, highlights, specs,
  care_instructions, delivery_options, collection_items, published
) values (
  'brooklyn',
  'Brooklyn 3 Seater Sofa',
  'Ivory',
  79900,
  4066,
  'MS3CI',
  'Add a touch of contemporary style to your home with the Brooklyn 3-Seater sofa in Ivory Chenille.',
  '[
    {"heading": "Modern simplicity", "body": "Chic, elegant and stylish, the Brooklyn 3-seater Sofa boasts smooth, clean lines that will blend perfectly with any modern interior. Made with a premium textured chenille fabric in classic ivory, this sofa has fibre filled back cushions, and pocket sprung seats that provide exceptional comfort and lasting durability."},
    {"heading": "Good Housekeeping approved", "body": "The Brooklyn Sofa Collection has been tried, tested and approved by the experts at Good Housekeeping, praised for its comfort, craftsmanship and timeless style."},
    {"heading": "Built for everyday luxury", "body": "Lazy days with the family, movie nights with friends, or simply stretching out for an afternoon snooze — this is a sofa where you can enjoy every luxurious moment."},
    {"heading": "Easy assembly", "body": "Your Brooklyn 3-seater sofa will be delivered in three separate pieces, and is very easy to assemble. Full instructions are included so you will be ready to kick back and relax in no time at all."}
  ]'::jsonb,
  array[
    'Premium textured chenille fabric',
    'Fibre-filled back cushions',
    'Pocket sprung seats',
    'Solid wood frame',
    'Delivered in 3 easy-to-assemble pieces',
    'Good Housekeeping approved collection'
  ],
  '[
    {"label": "SKU", "value": "MS3CI"},
    {"label": "Fabric", "value": "Chenille"},
    {"label": "Fabric Composition", "value": "100% Polyester"},
    {"label": "Dimensions", "value": "W: 266 x D: 98 x H: 82.5cm"},
    {"label": "Colour", "value": "Ivory"},
    {"label": "Frame Material", "value": "Solid Wood"},
    {"label": "Floor to Seat Height", "value": "41cm"},
    {"label": "Seat Depth", "value": "73cm"}
  ]'::jsonb,
  array[
    'Hand wash or professional clean only — no machine washing.',
    'Clean with vacuum attachment or lint roller to stop dust build up.',
    'Keep away from direct sunlight and heat sources.',
    'Wipe spills quickly by gently dabbing with a dry cloth.'
  ],
  '[
    {"service": "Medium Box Delivery", "cost": "£19.99", "timeframe": "Choose your delivery day"},
    {"service": "Large Box Delivery", "cost": "£29.99", "timeframe": "Choose your delivery day"},
    {"service": "X-Large Box Delivery", "cost": "£39.99", "timeframe": "Choose your delivery day"}
  ]'::jsonb,
  '[
    {"name": "Brooklyn 2 Seater Sofa", "price": 659},
    {"name": "Brooklyn 3 Seater Sofa", "price": 799},
    {"name": "Brooklyn Small L-Shape Sofa", "price": 999},
    {"name": "Brooklyn U-Shape Sofa", "price": 1499}
  ]'::jsonb,
  true
) on conflict (slug) do nothing;

-- Seed images for Brooklyn (only if product exists and no images yet)
insert into public.product_images (product_id, url, alt, sort_order)
select p.id, img.url, img.alt, img.sort_order
from public.products p
cross join (
  values
    ('https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-995870.jpg?v=1705428915', 'Brooklyn 3 Seater Sofa - Ivory front view', 0),
    ('https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-140532.jpg?v=1706582986', 'Brooklyn 3 Seater Sofa - Ivory styled living room', 1),
    ('https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-315184.jpg?v=1705428911', 'Brooklyn 3 Seater Sofa - Ivory angle view', 2),
    ('https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-237542.jpg?v=1706548304', 'Brooklyn 3 Seater Sofa - Ivory detail', 3)
) as img(url, alt, sort_order)
where p.slug = 'brooklyn'
  and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_reviews (product_id, author, title, body, rating, image_urls)
select p.id, r.author, r.title, r.body, r.rating, r.image_urls
from public.products p
cross join (
  values
    ('Tia Harding', 'Amazing quality!', 'Loveeee this sofa! So happy with the look, feel and quality.', 5, '{}'::text[]),
    ('Leah', 'Fantastic sofa! Classy and good quality!', 'Really good quality sofa! We bought one in ivory last year and another in black for our other room. Comfortable, classy and easy to clean!', 5, '{}'::text[]),
    ('Joanne', 'Ivory Brooklyn range', 'Delivered on the exact day scheduled. Very well packaged and easy to handle. The fabric is gorgeous and so comfortable. Would definitely recommend.', 5, '{}'::text[]),
    ('Daisy Munyanyi', 'Amazing quality', 'The sofa is bigger than how it looks in the picture. Very comfortable too.', 5, '{}'::text[])
) as r(author, title, body, rating, image_urls)
where p.slug = 'brooklyn'
  and not exists (select 1 from public.product_reviews pr where pr.product_id = p.id);
