import Image from 'next/image';

const badge =
  'inline-flex items-center justify-center h-10 px-3 rounded-lg border border-[#E8E6E1] bg-white';

/** Official brand marks — Clearpay uses a text badge (no external asset). */
const PAYMENT_MARKS = [
  {
    name: 'Stripe',
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    width: 56,
    height: 24,
  },
  {
    name: 'Apple Pay',
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg',
    width: 44,
    height: 18,
  },
  {
    name: 'Google Pay',
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg',
    width: 48,
    height: 20,
  },
  {
    name: 'Klarna',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg',
    width: 52,
    height: 22,
  },
] as const;

function ClearpayBadge() {
  return (
    <span
      className={`${badge} border-[#B2FCE4] bg-[#B2FCE4] px-4`}
      title="Clearpay"
    >
      <span className="text-sm font-bold text-black tracking-tight lowercase">clearpay</span>
    </span>
  );
}

export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {PAYMENT_MARKS.map((mark) => (
        <span key={mark.name} className={badge} title={mark.name}>
          <Image
            src={mark.src}
            alt={mark.name}
            width={mark.width}
            height={mark.height}
            className="h-5 w-auto object-contain"
            unoptimized
          />
        </span>
      ))}
      <ClearpayBadge />
    </div>
  );
}
