import { kv } from '@vercel/kv';

export const prerender = false;

export async function POST({ request }) {
  const secret = import.meta.env.SEED_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'SEED_SECRET not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { t1, t2, t3 } = await request.json();
  if (t1 == null || t2 == null || t3 == null) {
    return new Response(JSON.stringify({ error: 'provide t1, t2, t3' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await Promise.all([
    kv.set('ek:t1:claimed', Number(t1)),
    kv.set('ek:t2:claimed', Number(t2)),
    kv.set('ek:t3:claimed', Number(t3)),
  ]);

  return new Response(JSON.stringify({ ok: true, seeded: { t1, t2, t3 } }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
