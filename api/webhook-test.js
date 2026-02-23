import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const checks = {
    kv_connected: false,
    kv_values: null,
    env_square_token: !!process.env.SQUARE_ACCESS_TOKEN,
    env_sig_key: !!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
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

  return res.status(200).json(checks);
}
