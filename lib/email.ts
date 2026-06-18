import { EMAIL_FROM } from './brand';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipped:', options.subject);
    return { ok: false, skipped: true, error: 'Email not configured' };
  }

  const to = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });

    const data = (await res.json()) as { id?: string; message?: string };
    if (!res.ok) {
      console.error('[email] Resend error:', data);
      return { ok: false, error: data.message ?? 'Send failed' };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    console.error('[email] Send failed:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Send failed' };
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
