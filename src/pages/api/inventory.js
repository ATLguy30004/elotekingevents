import { kv } from '@vercel/kv';

export const prerender = false;

const DEFAULTS = { t1: 4, t2: 7, t3: 1 };

export async function GET() {
  try {
    const [t1, t2, t3] = await Promise.all([
      kv.get('ek:t1:claimed'),
      kv.get('ek:t2:claimed'),
      kv.get('ek:t3:claimed'),
    ]);

    return new Response(JSON.stringify({
      t1: t1 ?? DEFAULTS.t1,
      t2: t2 ?? DEFAULTS.t2,
      t3: t3 ?? DEFAULTS.t3,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch {
    return new Response(JSON.stringify(DEFAULTS), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
