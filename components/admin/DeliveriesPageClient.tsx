'use client';

import { useCallback, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
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
};

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
  const [manual, setManual] = useState({
    driver_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    items_description: '',
    notes: '',
  });

  const refresh = useCallback(async (targetDate: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/deliveries?date=${targetDate}`);
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

  async function scheduleOrder(orderId: string, driverId: string) {
    setLoading(true);
    const res = await fetch('/api/admin/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order',
        order_id: orderId,
        driver_id: driverId || null,
        delivery_date: date,
      }),
    });
    if (res.ok) await refresh(date);
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
            Allocate website orders to drivers and add manual deliveries
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
          <button
            type="button"
            onClick={() => setShowManualForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-black"
          >
            <Plus className="w-4 h-4" />
            Add delivery
          </button>
        </div>
      </div>

      {showManualForm && (
        <form onSubmit={submitManual} className="bg-white border border-[#EBEAE6] rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="font-semibold">New manual delivery</h2>
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
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl"
            >
              Save delivery
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

      {unscheduled.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Website orders — not yet scheduled</h2>
          <div className="space-y-3">
            {unscheduled.map((order) => (
              <div key={order.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-wrap gap-4 justify-between items-start">
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-sm text-[#64625D]">{order.shipping_address}</p>
                  <p className="text-xs text-[#8A8782] mt-1">
                    £{(order.total_pence / 100).toFixed(2)} · {new Date(order.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    id={`assign-${order.id}`}
                    defaultValue=""
                    className="px-3 py-2 rounded-xl border border-[#EBEAE6] bg-white text-sm"
                  >
                    <option value="" disabled>Assign driver…</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const select = document.getElementById(`assign-${order.id}`) as HTMLSelectElement;
                      scheduleOrder(order.id, select.value);
                    }}
                    className="bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
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
          No deliveries for this date. Add a manual delivery or schedule a website order.
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
      {jobs.map((job) => (
        <div key={job.id} className="bg-white border border-[#EBEAE6] rounded-2xl p-5">
          <div className="flex flex-wrap gap-4 justify-between items-start">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{job.customer_name}</p>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  job.source === 'website' ? 'bg-blue-100 text-blue-800' : 'bg-[#F4F3EF] text-[#64625D]'
                }`}>
                  {job.source}
                </span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  job.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F4F3EF] text-[#64625D]'
                }`}>
                  {statusLabel[job.status] ?? job.status}
                </span>
              </div>
              <p className="text-sm text-[#64625D] whitespace-pre-wrap">{job.delivery_address}</p>
              {job.items_description && (
                <p className="text-sm mt-2">{job.items_description}</p>
              )}
              {job.customer_phone && <p className="text-sm text-[#8A8782] mt-1">{job.customer_phone}</p>}
              {job.notes && <p className="text-xs text-[#8A8782] mt-1 italic">{job.notes}</p>}
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
      ))}
    </div>
  );
}
