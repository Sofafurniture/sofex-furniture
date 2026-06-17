# Sofex Furniture

Next.js e-commerce site for Sofex Furniture — product configurator, Stripe checkout, admin panel, and driver delivery scheduling.

## Stack

- **Next.js 15** (App Router)
- **Supabase** (orders, products, deliveries)
- **Stripe** (payments)
- **Netlify** (hosting)

## Local development

```bash
npm install
cp .env.example .env.local   # add your keys
npm run dev
```

Open http://localhost:3000

### Admin & driver portals

| Portal | URL | Default login |
|--------|-----|---------------|
| Admin | `/admin/login` | `admin@sofex.furniture` / `admin123` |
| Driver | `/driver/login` | `driver1@sofex.furniture` / `driver123` |

Change credentials in `.env.local` before production.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run all SQL files in `supabase/migrations/` in the SQL editor (in order: 001, 002, 003)
3. Copy **Project URL**, **anon key**, and **service role key** into env vars

## Netlify deployment

1. Push this repo to GitHub
2. In Netlify: **Add new site → Import from Git**
3. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Plugin: `@netlify/plugin-nextjs`
4. Add environment variables (Site settings → Environment variables) — same as `.env.example`
5. Set `NEXT_PUBLIC_SITE_URL` to your Netlify URL (e.g. `https://your-site.netlify.app`)
6. After deploy, add Stripe webhook endpoint: `https://your-site.netlify.app/api/webhooks/stripe`

## Environment variables

See `.env.example` for the full list.

### Stripe setup (required for checkout)

1. Create a Stripe account at [stripe.com](https://stripe.com) (use your **Sofafurniture** business account).
2. Copy keys from [Dashboard → API keys](https://dashboard.stripe.com/apikeys):
   - `STRIPE_SECRET_KEY` — Secret key (`sk_test_...` or `sk_live_...`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Publishable key (`pk_test_...` or `pk_live_...`)
3. Add to **Netlify** → Site settings → Environment variables (and `.env.local` for local dev).
4. Enable payment methods at [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods):
   - Cards (includes **Apple Pay** & **Google Pay** when enabled)
   - **Klarna**
   - **Clearpay** (Afterpay/Clearpay)
5. Create a webhook: [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
   - Endpoint: `https://sofex-furniture.netlify.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET` (`whsec_...`)

### Supabase Auth (optional — Google & Apple sign-in)

In Supabase Dashboard → Authentication → Providers, enable Google and Apple, then add redirect URL:
`https://sofex-furniture.netlify.app/auth/callback`

