import { kv } from '@vercel/kv';

export const prerender = false;

export async function GET() {
  const checks = {
    kv_connected: false,
    kv_values: null,
    env_square_token: !!import.meta.env.SQUARE_ACCESS_TOKEN,
    env_sig_key: !!import.meta.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
    env_seed_secret: !!import.meta.env.SEED_SECRET,
  };

  try {
    const [t1, t2, t3] = await Promise.all([
      kv.get('ek:t1:claimed'),
      kv.get('ek:t2:claimed'),
      kv.get('ek:t3:claimed'),
    ]);
    checks.kv_connected = true;
    checks.kv_values = { t1, t2, t3 };
  } catch (err) {
    checks.kv_error = err.message;
  }

  return new Response(JSON.stringify(checks, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
