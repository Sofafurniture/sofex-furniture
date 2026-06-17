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

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  });
}

/** Next 7 available delivery days (skips Sundays). */
export function getDeliveryDays(): DeliveryDay[] {
  const days: DeliveryDay[] = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);

  let cursor = addDays(start, 2); // earliest 2 days out for bespoke build handoff
  while (days.length < 7) {
    if (cursor.getDay() !== 0) {
      const iso = cursor.toISOString().slice(0, 10);
      days.push({
        date: iso,
        label: formatDayLabel(cursor),
        slots: TIME_SLOTS,
      });
    }
    cursor = addDays(cursor, 1);
  }
  return days;
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
