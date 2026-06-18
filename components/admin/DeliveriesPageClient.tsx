'use client';

import { useCallback, useMemo, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { formatOrderDescription } from '@/lib/delivery-db';
import { formatDistanceFromHub } from '@/lib/delivery-distance';
import { buildMapLinks } from '@/lib/map-links';
import type { Order } from '@/lib/admin-types';
import type { DeliveryJob, Driver } from '@/lib/delivery-types';

interface DeliveriesPageClientProps {
  initialDate: string;
  initialDrivers: Driver[];
  initialJobs: DeliveryJob[];
  initialUnscheduled: Order[];
}

const statusLabel: Record<string, string> = {
  scheduled: 'Scheduled',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  unable_to_deliver: 'Unable to deliver',
};

const orderStatusLabel: Record<string, string> = {
  pending: 'Payment pending',
  paid: 'Paid',
};

function orderOptionLabel(order: Order): string {
  const date = new Date(order.created_at).toLocaleDateString('en-GB');
  const total = `£${(order.total_pence / 100).toFixed(2)}`;
  const status = orderStatusLabel[order.status] ?? order.status;
  return `${order.customer_name} · ${total} · ${date} · ${status}`;
}

export function DeliveriesPageClient({
  initialDate,
  initialDrivers,
  initialJobs,
  initialUnscheduled,
}: DeliveriesPageClientProps) {
  const [date, setDate] = useState(initialDate);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [jobs, setJobs] = useState(initialJobs);
  const [unscheduled, setUnscheduled] = useState(initialUnscheduled);
  const [loading, setLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [assignDriverId, setAssignDriverId] = useState('');
  const [manual, setManual] = useState({
    driver_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    items_description: '',
    notes: '',
    is_cash_order: false,
  });

  const selectedOrder = useMemo(
    () => unscheduled.find((o) => o.id === selectedOrderId) ?? null,
    [unscheduled, selectedOrderId],
  );

  const refresh = useCallback(async (targetDate: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/deliveries?date=${targetDate}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setDrivers(data.drivers);
      setJobs(data.jobs);
      setUnscheduled(data.unscheduledOrders);
    }
    setLoading(false);
  }, []);

  async function handleDateChange(newDate: string) {
    setDate(newDate);
    await refresh(newDate);
  }

  async function scheduleSelectedOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrderId) return;

    setLoading(true);
    const res = await fetch('/api/admin/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order',
        order_id: selectedOrderId,
        driver_id: assignDriverId || null,
        delivery_date: date,
      }),
    });
    if (res.ok) {
      setSelectedOrderId('');
      setAssignDriverId('');
      await refresh(date);
    }
    setLoading(false);
  }

  async function assignDriver(jobId: string, driverId: string) {
    const res = await fetch(`/api/admin/deliveries/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: driverId || null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    }
  }

  async function removeJob(jobId: string) {
    if (!confirm('Remove this delivery from the schedule?')) return;
    const res = await fetch(`/api/admin/deliveries/${jobId}`, { method: 'DELETE' });
    if (res.ok) await refresh(date);
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'manual',
        delivery_date: date,
        driver_id: manual.driver_id || null,
        customer_name: manual.customer_name,
        customer_email: manual.customer_email || null,
        customer_phone: manual.customer_phone || null,
        delivery_address: manual.delivery_address,
        items_description: manual.items_description || null,
        notes: manual.notes || null,
        is_cash_order: manual.is_cash_order,
      }),
    });
    if (res.ok) {
      setManual({
        driver_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        delivery_address: '',
        items_description: '',
        notes: '',
        is_cash_order: false,
      });
      setShowManualForm(false);
      await refresh(date);
    }
    setLoading(false);
  }

  const unassigned = jobs.filter((j) => !j.driver_id);
  const jobsByDriver = drivers.map((driver) => ({
    driver,
    jobs: jobs.filter((j) => j.driver_id === driver.id),
  }));

  return (
    <div className="p-8 lg:p-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Delivery Schedule</h1>
          <p className="text-sm text-[#64625D] mt-1">
            Select a website order, assign a driver, and schedule the delivery
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#EBEAE6] bg-white text-sm"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[#8A8782]" />}
        </div>
      </div>

      <form onSubmit={scheduleSelectedOrder} className="bg-white border border-[#EBEAE6] rounded-2xl p-6 mb-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">Assign website order</h2>
            <p className="text-sm text-[#64625D] mt-1">
              {unscheduled.length} order{unscheduled.length === 1 ? '' : 's'} waiting to be scheduled
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowManualForm((v) => !v)}
            className="inline-flex items-center gap-2 border border-[#EBEAE6] text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:border-black"
          >
            <Plus className="w-4 h-4" />
            Manual delivery
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm md:col-span-2">
            <span className="text-xs text-[#64625D] uppercase tracking-wider">Website order *</span>
            <select
              required
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
            >
              <option value="" disabled>
                {unscheduled.length ? 'Select an order…' : 'No unscheduled orders'}
              </option>
              {unscheduled.map((order) => (
                <option key={order.id} value={order.id}>
                  {orderOptionLabel(order)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs text-[#64625D] uppercase tracking-wider">Assign driver</span>
            <select
              value={assignDriverId}
              onChange={(e) => setAssignDriverId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
            >
              <option value="">Unassigned for now</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs text-[#64625D] uppercase tracking-wider">Delivery date</span>
            <input
              type="date"
              value={date}
              readOnly
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#F4F3EF] text-[#64625D]"
            />
          </label>
        </div>

        {selectedOrder && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#8A8782] mb-1">Customer</p>
              <p className="font-semibold">{selectedOrder.customer_name}</p>
              <p className="text-[#64625D]">{selectedOrder.customer_email}</p>
              {typeof selectedOrder.configuration.customerPhone === 'string' && (
                <p className="text-[#64625D]">{selectedOrder.configuration.customerPhone}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#8A8782] mb-1">Order</p>
              <p className="text-[#64625D]">{formatOrderDescription(selectedOrder.configuration)}</p>
              <p className="font-mono font-semibold mt-1">£{(selectedOrder.total_pence / 100).toFixed(2)}</p>
              <span className={`inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                selectedOrder.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {orderStatusLabel[selectedOrder.status] ?? selectedOrder.status}
              </span>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#8A8782] mb-1">Delivery address</p>
              <p className="text-[#64625D] whitespace-pre-wrap">{selectedOrder.shipping_address}</p>
            </div>
            {typeof selectedOrder.configuration.deliveryLabel === 'string' && (
              <div className="sm:col-span-2">
                <p className="text-xs font-mono uppercase tracking-wider text-[#8A8782] mb-1">Customer&apos;s requested slot</p>
                <p className="text-[#64625D]">{selectedOrder.configuration.deliveryLabel}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedOrderId || unscheduled.length === 0}
          className="bg-[#1C1B1A] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-black"
        >
          Schedule delivery
        </button>
      </form>

      {showManualForm && (
        <form onSubmit={submitManual} className="bg-white border border-[#EBEAE6] rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="font-semibold">Manual delivery (non-website)</h2>
          <p className="text-sm text-[#64625D]">Use this only for deliveries not placed through the website.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Driver</span>
              <select
                value={manual.driver_id}
                onChange={(e) => setManual((m) => ({ ...m, driver_id: e.target.value }))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              >
                <option value="">Unassigned</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Customer name *</span>
              <input
                required
                value={manual.customer_name}
                onChange={(e) => setManual((m) => ({ ...m, customer_name: e.target.value }))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Email</span>
              <input
                type="email"
                value={manual.customer_email}
                onChange={(e) => setManual((m) => ({ ...m, customer_email: e.target.value }))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Phone</span>
              <input
                value={manual.customer_phone}
                onChange={(e) => setManual((m) => ({ ...m, customer_phone: e.target.value }))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Delivery address *</span>
              <textarea
                required
                rows={2}
                value={manual.delivery_address}
                onChange={(e) => setManual((m) => ({ ...m, delivery_address: e.target.value }))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Items / description</span>
              <input
                value={manual.items_description}
                onChange={(e) => setManual((m) => ({ ...m, items_description: e.target.value }))}
                placeholder="e.g. Lavencia 3 Seater, grey fabric"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-xs text-[#64625D] uppercase tracking-wider">Notes</span>
              <input
                value={manual.notes}
                onChange={(e) => setManual((m) => ({ ...m, notes: e.target.value }))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]"
              />
            </label>
            <label className="flex items-center gap-3 text-sm md:col-span-2 cursor-pointer">
              <input
                type="checkbox"
                checked={manual.is_cash_order}
                onChange={(e) => setManual((m) => ({ ...m, is_cash_order: e.target.checked }))}
                className="rounded border-[#EBEAE6]"
              />
              <span>
                <span className="text-xs text-[#64625D] uppercase tracking-wider block">Cash order</span>
                <span className="text-xs text-[#8A8782]">Driver will record cash received on delivery</span>
              </span>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl"
            >
              Save manual delivery
            </button>
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="text-sm text-[#64625D] px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {unassigned.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Unassigned for {date}</h2>
          <JobList jobs={unassigned} drivers={drivers} onAssign={assignDriver} onRemove={removeJob} />
        </section>
      )}

      {jobsByDriver.map(({ driver, jobs: driverJobs }) => (
        <section key={driver.id} className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            {driver.name}
            <span className="text-sm font-normal text-[#8A8782] ml-2">({driverJobs.length} deliveries)</span>
          </h2>
          {driverJobs.length === 0 ? (
            <p className="text-sm text-[#8A8782] bg-white border border-[#EBEAE6] rounded-2xl p-6">No deliveries scheduled.</p>
          ) : (
            <JobList jobs={driverJobs} drivers={drivers} onAssign={assignDriver} onRemove={removeJob} />
          )}
        </section>
      ))}

      {jobs.length === 0 && unscheduled.length === 0 && (
        <div className="bg-white border border-[#EBEAE6] rounded-2xl p-12 text-center text-[#64625D]">
          No deliveries scheduled for this date and no website orders waiting.
        </div>
      )}
    </div>
  );
}

function JobList({
  jobs,
  drivers,
  onAssign,
  onRemove,
}: {
  jobs: DeliveryJob[];
  drivers: Driver[];
  onAssign: (jobId: string, driverId: string) => void;
  onRemove: (jobId: string) => void;
}) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const mapLinks = buildMapLinks(job.delivery_address);
        return (
          <div key={job.id} className="bg-white border border-[#EBEAE6] rounded-2xl p-5">
            <div className="flex flex-wrap gap-4 justify-between items-start">
              <div className="flex-1 min-w-[200px]">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold">{job.customer_name}</p>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    job.source === 'website' ? 'bg-blue-100 text-blue-800' : 'bg-[#F4F3EF] text-[#64625D]'
                  }`}>
                    {job.source}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    job.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : job.status === 'unable_to_deliver'
                        ? 'bg-amber-100 text-amber-800'
                        : job.status === 'out_for_delivery'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-[#F4F3EF] text-[#64625D]'
                  }`}>
                    {statusLabel[job.status] ?? job.status}
                  </span>
                  {job.is_cash_order && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Cash
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-800 font-medium mb-2">
                  {formatDistanceFromHub(job.distance_miles)}
                </p>
                <p className="text-sm text-[#64625D] whitespace-pre-wrap">{job.delivery_address}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mapLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-wider text-blue-700 underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                {job.items_description && (
                  <p className="text-sm mt-2">{job.items_description}</p>
                )}
                {job.customer_phone && <p className="text-sm text-[#8A8782] mt-1">{job.customer_phone}</p>}
                {job.notes && (
                  <p className="text-xs text-[#8A8782] mt-2">
                    <span className="font-semibold">Admin notes:</span> {job.notes}
                  </p>
                )}
                {job.driver_remarks && (
                  <p className="text-xs text-[#64625D] mt-2 bg-[#F4F3EF] rounded-lg p-2">
                    <span className="font-semibold">Driver remarks:</span> {job.driver_remarks}
                  </p>
                )}
                {job.unable_to_deliver_notes && (
                  <p className="text-xs text-amber-800 mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2">
                    <span className="font-semibold">Unable to deliver:</span> {job.unable_to_deliver_notes}
                  </p>
                )}
                {job.cash_received_pence != null && (
                  <p className="text-sm font-mono font-semibold text-emerald-800 mt-2">
                    Cash received: £{(job.cash_received_pence / 100).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={job.driver_id ?? ''}
                  onChange={(e) => onAssign(job.id, e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
                >
                  <option value="">Unassigned</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onRemove(job.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
