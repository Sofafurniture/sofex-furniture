export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#64625D]">
      <span className="px-2.5 py-1 rounded-md border border-[#EBEAE6] bg-white">Stripe</span>
      <span className="px-2.5 py-1 rounded-md border border-[#EBEAE6] bg-white">Apple Pay</span>
      <span className="px-2.5 py-1 rounded-md border border-[#EBEAE6] bg-white">Google Pay</span>
      <span className="px-2.5 py-1 rounded-md border border-[#EBEAE6] bg-white">Klarna</span>
      <span className="px-2.5 py-1 rounded-md border border-[#EBEAE6] bg-white">Clearpay</span>
    </div>
  );
}
