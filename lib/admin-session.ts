const COOKIE_NAME = 'sofex_admin_session';
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'dev-admin-secret-change-me';
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function createAdminSession(email: string): Promise<string> {
  const exp = Date.now() + SESSION_MS;
  const payload = JSON.stringify({ email, exp });
  const signature = await sign(payload);
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64url');
}

export async function verifyAdminSession(token: string): Promise<{ email: string } | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as {
      payload: string;
      signature: string;
    };
    const expected = await sign(decoded.payload);
    if (!timingSafeEqualHex(decoded.signature, expected)) return null;

    const { email, exp } = JSON.parse(decoded.payload) as { email: string; exp: number };
    if (Date.now() > exp) return null;
    return { email };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
