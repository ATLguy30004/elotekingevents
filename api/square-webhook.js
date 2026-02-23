import { kv } from '@vercel/kv';
import crypto from 'crypto';

// Maps Square item names (lowercase) to KV keys
const TIER_MAP = {
  'the taste':        'ek:t1:claimed',
  "the king's table": 'ek:t2:claimed',
  'the royal feast':  'ek:t3:claimed',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function verifySignature(rawBody, signature, sigKey, webhookUrl) {
  const hash = crypto
    .createHmac('sha256', sigKey)
    .update(webhookUrl + rawBody)
    .digest('base64');
  return hash === signature;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await readBody(req);

  // Verify Square signature if key is set
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (sigKey) {
    const sig = req.headers['x-square-hmacsha256-signature'];
    const url = `https://${req.headers.host}/api/square-webhook`;
    if (!verifySignature(rawBody, sig, sigKey, url)) {
      return res.status(401).json({ error: 'invalid signature' });
    }
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'invalid json' });
  }

  // Only act on completed payments
  if (event.type !== 'payment.completed') {
    return res.status(200).json({ ok: true, skipped: event.type });
  }

  const orderId = event?.data?.object?.payment?.order_id;
  if (!orderId) {
    return res.status(200).json({ ok: true, skipped: 'no order_id' });
  }

  // Fetch full order from Square to get line items + quantities
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const orderRes = await fetch(
    `https://connect.squareup.com/v2/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json',
      },
    }
  );
  const orderData = await orderRes.json();
  const lineItems = orderData?.order?.line_items || [];

  // Build a map of { kvKey: totalQty } for this order
  const updates = {};
  for (const item of lineItems) {
    const key = TIER_MAP[item.name?.toLowerCase()];
    if (key) {
      updates[key] = (updates[key] || 0) + (parseInt(item.quantity, 10) || 1);
    }
  }

  // Increment counts in KV
  await Promise.all(
    Object.entries(updates).map(([key, qty]) => kv.incrby(key, qty))
  );

  return res.status(200).json({ ok: true, updates });
}
