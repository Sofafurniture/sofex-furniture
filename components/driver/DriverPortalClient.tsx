'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, LogOut, MapPin, Package } from 'lucide-react';
import type { DeliveryJob } from '@/lib/delivery-types';
import { BRAND_NAME } from '@/lib/brand';

const statusLabel: Record<string, string> = {
  scheduled: 'Scheduled',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
};

export function DriverPortalClient({ driverName }: { driverName: string }) {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async (targetDate: string) => {
    setLoading(true);
    const res = await fetch(`/api/driver/deliveries?date=${targetDate}`);
    if (res.ok) {
      const data = await res.json();
      setJobs(data.jobs);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  async function updateStatus(jobId: string, status: 'out_for_delivery' | 'delivered') {
    setUpdatingId(jobId);
    const res = await fetch(`/api/driver/deliveries/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    }
    setUpdatingId(null);
  }

  async function handleLogout() {
    await fetch('/api/driver/logout', { method: 'POST' });
    router.push('/driver/login');
    router.refresh();
  }

  const pending = jobs.filter((j) => j.status !== 'delivered');
  const completed = jobs.filter((j) => j.status === 'delivered');

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      <header className="bg-[#1C1B1A] text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">{BRAND_NAME}</p>
          <h1 className="text-xl font-semibold">Driver deliveries</h1>
          <p className="text-sm text-white/70 mt-0.5">Signed in as {driverName}</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white text-sm [color-scheme:dark]"
          />
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white px-3 py-2"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#8A8782]" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EBEAE6] p-12 text-center text-[#64625D]">
            No deliveries allocated for this day.
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64625D] mb-4">
                  Today&apos;s route ({pending.length})
                </h2>
                <div className="space-y-4">
                  {pending.map((job, index) => (
                    <DeliveryCard
                      key={job.id}
                      job={job}
                      index={index + 1}
                      updating={updatingId === job.id}
                      onStatus={updateStatus}
                    />
                  ))}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64625D] mb-4">
                  Completed ({completed.length})
                </h2>
                <div className="space-y-4 opacity-75">
                  {completed.map((job, index) => (
                    <DeliveryCard
                      key={job.id}
                      job={job}
                      index={index + 1}
                      updating={false}
                      onStatus={updateStatus}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function DeliveryCard({
  job,
  index,
  updating,
  onStatus,
}: {
  job: DeliveryJob;
  index: number;
  updating: boolean;
  onStatus: (id: string, status: 'out_for_delivery' | 'delivered') => void;
}) {
  return (
    <article className="bg-white rounded-2xl border border-[#EBEAE6] p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1C1B1A] text-white text-sm font-semibold flex items-center justify-center">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{job.customer_name}</h3>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F3EF] text-[#64625D]">
              {statusLabel[job.status] ?? job.status}
            </span>
          </div>

          <p className="flex items-start gap-2 text-sm text-[#64625D] mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="whitespace-pre-wrap">{job.delivery_address}</span>
          </p>

          {job.items_description && (
            <p className="flex items-start gap-2 text-sm mb-2">
              <Package className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#8A8782]" />
              {job.items_description}
            </p>
          )}

          {job.customer_phone && (
            <p className="text-sm">
              <a href={`tel:${job.customer_phone}`} className="text-blue-700 underline">
                {job.customer_phone}
              </a>
            </p>
          )}

          {job.notes && (
            <p className="text-xs text-[#8A8782] mt-2 italic">{job.notes}</p>
          )}

          {job.status !== 'delivered' && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.status === 'scheduled' && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => onStatus(job.id, 'out_for_delivery')}
                  className="text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-[#EBEAE6] hover:bg-[#F4F3EF] disabled:opacity-50"
                >
                  Out for delivery
                </button>
              )}
              <button
                type="button"
                disabled={updating}
                onClick={() => onStatus(job.id, 'delivered')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                Mark delivered
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
