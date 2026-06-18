'use client';

import { useState } from 'react';
import { Loader2, Mail, Send } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <Mail className="w-8 h-8 text-emerald-800 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-emerald-900 mb-2">Message sent</h2>
        <p className="text-sm text-emerald-800">
          Thank you — we&apos;ve received your enquiry and will reply as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-xs font-semibold uppercase tracking-widest text-emerald-900 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs text-[#64625D]">Name *</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[#64625D]">Email *</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-[#64625D]">Phone (optional)</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
        />
      </label>

      <label className="block">
        <span className="text-xs text-[#64625D]">Subject *</span>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
        />
      </label>

      <label className="block">
        <span className="text-xs text-[#64625D]">Message *</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm resize-y"
        />
      </label>

      {error && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1C1B1A] hover:bg-black disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
