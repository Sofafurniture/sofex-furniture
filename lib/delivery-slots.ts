export interface DeliverySlot {
  id: string;
  label: string;
}

export interface DeliveryDay {
  date: string;
  label: string;
  slots: DeliverySlot[];
}

const TIME_SLOTS: DeliverySlot[] = [
  { id: 'morning', label: 'Morning (9am – 12pm)' },
  { id: 'afternoon', label: 'Afternoon (12pm – 3pm)' },
  { id: 'evening', label: 'Evening (3pm – 6pm)' },
];

/** Minimum calendar days after order date before first delivery slot (excludes today + tomorrow). */
export const MIN_DELIVERY_LEAD_DAYS = 2;

const LONDON_TZ = 'Europe/London';

function londonCalendarDate(base = new Date()): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(base);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get('year'), month: get('month'), day: get('day') };
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addLondonDays(year: number, month: number, day: number, days: number) {
  const utc = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return londonCalendarDate(utc);
}

function londonWeekday(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

function formatDayLabel(year: number, month: number, day: number): string {
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

/** Next 7 delivery days (skips Sundays). Earliest is today + MIN_DELIVERY_LEAD_DAYS in London. */
export function getDeliveryDays(): DeliveryDay[] {
  const today = londonCalendarDate();
  const days: DeliveryDay[] = [];
  let offset = MIN_DELIVERY_LEAD_DAYS;

  while (days.length < 7) {
    const { year, month, day } = addLondonDays(today.year, today.month, today.day, offset);
    if (londonWeekday(year, month, day) !== 0) {
      days.push({
        date: toIsoDate(year, month, day),
        label: formatDayLabel(year, month, day),
        slots: TIME_SLOTS,
      });
    }
    offset += 1;
  }

  return days;
}

export function isDeliveryDateAllowed(date: string): boolean {
  const allowed = new Set(getDeliveryDays().map((d) => d.date));
  return allowed.has(date);
}

/** Basic UK postcode check for London-area delivery messaging. */
export function looksLikeUkPostcode(postcode: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode.trim());
}

export function formatDeliverySlot(date: string, slotId: string): string {
  const day = getDeliveryDays().find((d) => d.date === date);
  const slot = TIME_SLOTS.find((s) => s.id === slotId);
  return `${day?.label ?? date} · ${slot?.label ?? slotId}`;
}
