import { kv } from '@vercel/kv';

const DEFAULTS = { t1: 5, t2: 7, t3: 2 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const [t1, t2, t3] = await Promise.all([
      kv.get('ek:t1:claimed'),
      kv.get('ek:t2:claimed'),
      kv.get('ek:t3:claimed'),
    ]);

    return res.status(200).json({
      t1: t1 ?? DEFAULTS.t1,
      t2: t2 ?? DEFAULTS.t2,
      t3: t3 ?? DEFAULTS.t3,
    });
  } catch {
    return res.status(200).json(DEFAULTS);
  }
}
