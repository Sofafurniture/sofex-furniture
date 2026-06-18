import Image from 'next/image';

const badge =
  'inline-flex items-center justify-center h-10 px-3 rounded-lg border border-[#E8E6E1] bg-white';

/** Official brand marks via Wikimedia Commons (reliable, readable logos). */
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
  {
    name: 'Clearpay',
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Afterpay_logo.svg',
    width: 72,
    height: 18,
  },
] as const;

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
    </div>
  );
}
