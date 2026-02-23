import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = process.env.SEED_SECRET;
  if (!secret) return res.status(500).json({ error: 'SEED_SECRET not configured' });

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { t1, t2, t3 } = req.body || {};
  if (t1 == null || t2 == null || t3 == null) {
    return res.status(400).json({ error: 'provide t1, t2, t3' });
  }

  await Promise.all([
    kv.set('ek:t1:claimed', Number(t1)),
    kv.set('ek:t2:claimed', Number(t2)),
    kv.set('ek:t3:claimed', Number(t3)),
  ]);

  return res.status(200).json({ ok: true, seeded: { t1, t2, t3 } });
}
