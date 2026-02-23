import { kv } from '@vercel/kv';
import crypto from 'crypto';

export const prerender = false;

const PRICE_TIERS = [
  { min: 6000, key: 'ek:t3:claimed' },
  { min: 3200, key: 'ek:t2:claimed' },
  { min: 0,    key: 'ek:t1:claimed' },
];

function getTierFromAmount(cents) {
  for (const tier of PRICE_TIERS) {
    if (cents >= tier.min) return tier.key;
  }
  return null;
}

function getTierKey(name) {
  const n = (name || '').toLowerCase().trim();
  if (n.includes('royal feast')) return 'ek:t3:claimed';
  if (n.includes("king's table") || n.includes('kings table')) return 'ek:t2:claimed';
  if (n.includes('taste')) return 'ek:t1:claimed';
  return null;
}

function verifySignature(rawBody, signature, sigKey, webhookUrl) {
  const hash = crypto
    .createHmac('sha256', sigKey)
    .update(webhookUrl + rawBody)
    .digest('base64');
  return hash === signature;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  const rawBody = await request.text();

  const sigKey = import.meta.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (sigKey) {
    const sig = request.headers.get('x-square-hmacsha256-signature');
    const url = new URL(request.url);
    const webhookUrl = `${url.origin}/api/square-webhook`;
    if (!verifySignature(rawBody, sig, sigKey, webhookUrl)) {
      console.error('[webhook] signature mismatch');
      return json({ error: 'invalid signature' }, 401);
    }
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  console.log('[webhook] event type:', event.type);

  if (event.type !== 'payment.updated') {
    return json({ ok: true, skipped: event.type });
  }

  const payment = event?.data?.object?.payment;
  if (payment?.status !== 'COMPLETED') {
    console.log('[webhook] skipped status:', payment?.status);
    return json({ ok: true, skipped: 'status:' + payment?.status });
  }

  const paymentId = payment?.id;
  if (!paymentId) {
    return json({ ok: true, skipped: 'no payment id' });
  }

  const dedupKey = `ek:processed:${paymentId}`;
  try {
    const already = await kv.get(dedupKey);
    if (already) {
      console.log('[webhook] duplicate payment:', paymentId);
      return json({ ok: true, skipped: 'duplicate' });
    }
  } catch (err) {
    console.error('[webhook] KV dedup check failed:', err.message);
  }

  const orderId = payment?.order_id;
  const token = import.meta.env.SQUARE_ACCESS_TOKEN;
  let updates = {};

  if (orderId && token) {
    try {
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
      console.log('[webhook] order fetch status:', orderRes.status);

      const lineItems = orderData?.order?.line_items || [];
      for (const item of lineItems) {
        const key = getTierKey(item.name);
        if (key) {
          updates[key] = (updates[key] || 0) + (parseInt(item.quantity, 10) || 1);
        }
      }
      if (lineItems.length > 0) {
        console.log('[webhook] line items:', lineItems.map(i => `${i.name} x${i.quantity}`).join(', '));
      }
    } catch (err) {
      console.error('[webhook] order fetch failed:', err.message);
    }
  }

  if (Object.keys(updates).length === 0) {
    const cents = payment?.total_money?.amount;
    console.log('[webhook] fallback to amount:', cents, 'cents');
    if (cents) {
      const key = getTierFromAmount(cents);
      if (key) {
        updates[key] = 1;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    console.log('[webhook] no tier matched for payment:', paymentId);
    return json({ ok: true, skipped: 'no matching tier' });
  }

  try {
    await Promise.all([
      ...Object.entries(updates).map(([key, qty]) => kv.incrby(key, qty)),
      kv.set(dedupKey, 1, { ex: 60 * 60 * 24 * 30 }),
    ]);
    console.log('[webhook] KV updated:', JSON.stringify(updates));
  } catch (err) {
    console.error('[webhook] KV write failed:', err.message);
    return json({ error: 'kv write failed', detail: err.message }, 500);
  }

  return json({ ok: true, updates });
}
