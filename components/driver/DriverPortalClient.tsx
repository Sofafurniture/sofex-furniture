'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, Banknote, CheckCircle, Loader2, LogOut, MapPin, Navigation, Package, X,
} from 'lucide-react';
import { formatDistanceFromHub } from '@/lib/delivery-distance';
import { buildMapLinks } from '@/lib/map-links';
import type { DeliveryJob } from '@/lib/delivery-types';
import { BRAND_NAME } from '@/lib/brand';

const statusLabel: Record<string, string> = {
  scheduled: 'Scheduled',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  unable_to_deliver: 'Unable to deliver',
};

type ModalAction = { type: 'delivered' | 'unable'; job: DeliveryJob };

export function DriverPortalClient({ driverName }: { driverName: string }) {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalAction | null>(null);
  const [remarks, setRemarks] = useState('');
  const [unableNotes, setUnableNotes] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (targetDate: string) => {
    setLoading(true);
    const res = await fetch(`/api/driver/deliveries?date=${targetDate}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setJobs(data.jobs);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  async function patchJob(
    jobId: string,
    payload: {
      status: 'out_for_delivery' | 'delivered' | 'unable_to_deliver';
      driver_remarks?: string;
      unable_to_deliver_notes?: string;
      cash_received_pence?: number;
    },
  ) {
    setUpdatingId(jobId);
    setError(null);
    const res = await fetch(`/api/driver/deliveries/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as DeliveryJob & { error?: string };
    if (res.ok) {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? data : j)));
      setModal(null);
      setRemarks('');
      setUnableNotes('');
      setCashReceived('');
    } else {
      setError(data.error ?? 'Update failed');
    }
    setUpdatingId(null);
  }

  function openDeliveredModal(job: DeliveryJob) {
    setRemarks(job.driver_remarks ?? '');
    setCashReceived(
      job.cash_received_pence != null ? (job.cash_received_pence / 100).toFixed(2) : '',
    );
    setError(null);
    setModal({ type: 'delivered', job });
  }

  function openUnableModal(job: DeliveryJob) {
    setUnableNotes(job.unable_to_deliver_notes ?? '');
    setError(null);
    setModal({ type: 'unable', job });
  }

  async function submitModal(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;

    if (modal.type === 'delivered') {
      const cashPence = modal.job.is_cash_order
        ? Math.round(parseFloat(cashReceived || '0') * 100)
        : undefined;
      await patchJob(modal.job.id, {
        status: 'delivered',
        driver_remarks: remarks,
        cash_received_pence: cashPence,
      });
      return;
    }

    await patchJob(modal.job.id, {
      status: 'unable_to_deliver',
      unable_to_deliver_notes: unableNotes,
      driver_remarks: remarks,
    });
  }

  async function handleLogout() {
    await fetch('/api/driver/logout', { method: 'POST' });
    router.push('/driver/login');
    router.refresh();
  }

  const active = jobs.filter((j) => j.status === 'scheduled' || j.status === 'out_for_delivery');
  const issues = jobs.filter((j) => j.status === 'unable_to_deliver');
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
            {active.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64625D] mb-4">
                  Today&apos;s route ({active.length})
                </h2>
                <div className="space-y-4">
                  {active.map((job, index) => (
                    <DeliveryCard
                      key={job.id}
                      job={job}
                      index={index + 1}
                      updating={updatingId === job.id}
                      onOutForDelivery={() => patchJob(job.id, { status: 'out_for_delivery' })}
                      onMarkDelivered={() => openDeliveredModal(job)}
                      onUnableToDeliver={() => openUnableModal(job)}
                    />
                  ))}
                </div>
              </section>
            )}

            {issues.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-800 mb-4">
                  Unable to deliver ({issues.length})
                </h2>
                <div className="space-y-4">
                  {issues.map((job, index) => (
                    <DeliveryCard
                      key={job.id}
                      job={job}
                      index={index + 1}
                      updating={false}
                      readOnly
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
                <div className="space-y-4 opacity-80">
                  {completed.map((job, index) => (
                    <DeliveryCard
                      key={job.id}
                      job={job}
                      index={index + 1}
                      updating={false}
                      readOnly
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <form
            onSubmit={submitModal}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {modal.type === 'delivered' ? 'Mark as delivered' : 'Unable to deliver'}
                </h3>
                <p className="text-sm text-[#64625D] mt-1">{modal.job.customer_name}</p>
              </div>
              <button type="button" onClick={() => setModal(null)} className="p-1 text-[#8A8782]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modal.type === 'delivered' ? (
              <>
                {modal.job.is_cash_order && (
                  <label className="block text-sm">
                    <span className="text-xs text-[#64625D] uppercase tracking-wider flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5" />
                      Cash received (£) *
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      placeholder="0.00"
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
                    />
                  </label>
                )}
                <label className="block text-sm">
                  <span className="text-xs text-[#64625D] uppercase tracking-wider">Delivery remarks</span>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Left in living room, customer satisfied"
                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] resize-y"
                  />
                </label>
              </>
            ) : (
              <label className="block text-sm">
                <span className="text-xs text-[#64625D] uppercase tracking-wider">What happened? *</span>
                <textarea
                  required
                  rows={4}
                  value={unableNotes}
                  onChange={(e) => setUnableNotes(e.target.value)}
                  placeholder="e.g. Customer not home, access blocked, wrong address…"
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] resize-y"
                />
              </label>
            )}

            {error && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={updatingId === modal.job.id}
              className={`w-full text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xl text-white disabled:opacity-50 ${
                modal.type === 'delivered' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-amber-700 hover:bg-amber-800'
              }`}
            >
              {updatingId === modal.job.id ? 'Saving…' : modal.type === 'delivered' ? 'Confirm delivered' : 'Submit report'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function DeliveryCard({
  job,
  index,
  updating,
  readOnly,
  onOutForDelivery,
  onMarkDelivered,
  onUnableToDeliver,
}: {
  job: DeliveryJob;
  index: number;
  updating: boolean;
  readOnly?: boolean;
  onOutForDelivery?: () => void;
  onMarkDelivered?: () => void;
  onUnableToDeliver?: () => void;
}) {
  const mapLinks = buildMapLinks(job.delivery_address);

  return (
    <article className="bg-white rounded-2xl border border-[#EBEAE6] p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1C1B1A] text-white text-sm font-semibold flex items-center justify-center">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{job.customer_name}</h3>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
              job.status === 'unable_to_deliver'
                ? 'bg-amber-100 text-amber-800'
                : job.status === 'delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#F4F3EF] text-[#64625D]'
            }`}>
              {statusLabel[job.status] ?? job.status}
            </span>
            {job.is_cash_order && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Cash order
              </span>
            )}
          </div>

          <p className="text-xs text-emerald-800 font-medium mb-2">
            {formatDistanceFromHub(job.distance_miles)}
          </p>

          <p className="flex items-start gap-2 text-sm text-[#64625D] mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="whitespace-pre-wrap">{job.delivery_address}</span>
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {mapLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-[#EBEAE6] hover:border-black hover:bg-[#F4F3EF]"
              >
                <Navigation className="w-3 h-3" />
                {link.label}
              </a>
            ))}
          </div>

          {job.items_description && (
            <p className="flex items-start gap-2 text-sm mb-2">
              <Package className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#8A8782]" />
              {job.items_description}
            </p>
          )}

          {job.customer_phone && (
            <p className="text-sm mb-2">
              <a href={`tel:${job.customer_phone}`} className="text-blue-700 underline">
                {job.customer_phone}
              </a>
            </p>
          )}

          {job.notes && (
            <p className="text-xs text-[#8A8782] mb-1">
              <span className="font-semibold">Admin notes:</span> {job.notes}
            </p>
          )}

          {job.driver_remarks && (
            <p className="text-xs text-[#64625D] mb-1">
              <span className="font-semibold">Driver remarks:</span> {job.driver_remarks}
            </p>
          )}

          {job.unable_to_deliver_notes && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-2 mt-2">
              <span className="font-semibold">Unable to deliver:</span> {job.unable_to_deliver_notes}
            </p>
          )}

          {job.cash_received_pence != null && (
            <p className="text-sm font-mono font-semibold text-emerald-800 mt-2">
              Cash received: £{(job.cash_received_pence / 100).toFixed(2)}
            </p>
          )}

          {!readOnly && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.status === 'scheduled' && onOutForDelivery && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={onOutForDelivery}
                  className="text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-[#EBEAE6] hover:bg-[#F4F3EF] disabled:opacity-50"
                >
                  Out for delivery
                </button>
              )}
              {onMarkDelivered && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={onMarkDelivered}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                  Mark delivered
                </button>
              )}
              {onUnableToDeliver && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={onUnableToDeliver}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Unable to deliver
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
