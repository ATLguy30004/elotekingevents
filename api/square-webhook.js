import { kv } from '@vercel/kv';
import crypto from 'crypto';

// Map payment amount (cents) to tier. No Square API call needed —
// we identify the tier from the total_money in the webhook payload.
// Prices (with tax): Taste ~1499-2299, King's Table ~3699-4499, Royal Feast ~6499-7499
// Flan add-on adds ~$8. Quantity multiplies the total.
const PRICE_TIERS = [
  { min: 6000, key: 'ek:t3:claimed' },  // Royal Feast
  { min: 3200, key: 'ek:t2:claimed' },  // King's Table (with or without flan)
  { min: 0,    key: 'ek:t1:claimed' },  // The Taste (with or without flan)
];

function getTierFromAmount(cents) {
  for (const tier of PRICE_TIERS) {
    if (cents >= tier.min) return tier.key;
  }
  return null;
}

// Also match by item name when we have line items (from order fetch)
function getTierKey(name) {
  const n = (name || '').toLowerCase().trim();
  if (n.includes('royal feast')) return 'ek:t3:claimed';
  if (n.includes("king's table") || n.includes('kings table')) return 'ek:t2:claimed';
  if (n.includes('taste')) return 'ek:t1:claimed';
  return null;
}

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
      console.error('[webhook] signature mismatch');
      return res.status(401).json({ error: 'invalid signature' });
    }
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'invalid json' });
  }

  console.log('[webhook] event type:', event.type);

  if (event.type !== 'payment.updated') {
    return res.status(200).json({ ok: true, skipped: event.type });
  }

  const payment = event?.data?.object?.payment;
  if (payment?.status !== 'COMPLETED') {
    console.log('[webhook] skipped status:', payment?.status);
    return res.status(200).json({ ok: true, skipped: 'status:' + payment?.status });
  }

  const paymentId = payment?.id;
  if (!paymentId) {
    return res.status(200).json({ ok: true, skipped: 'no payment id' });
  }

  // Deduplicate — don't count the same payment twice
  const dedupKey = `ek:processed:${paymentId}`;
  try {
    const already = await kv.get(dedupKey);
    if (already) {
      console.log('[webhook] duplicate payment:', paymentId);
      return res.status(200).json({ ok: true, skipped: 'duplicate' });
    }
  } catch (err) {
    console.error('[webhook] KV dedup check failed:', err.message);
    // Continue anyway — better to risk a double-count than miss a sale
  }

  // PRIMARY: Try to get line items from the Square Orders API
  const orderId = payment?.order_id;
  const token = process.env.SQUARE_ACCESS_TOKEN;
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

  // FALLBACK: If order fetch failed or returned no matches, use payment amount
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
    return res.status(200).json({ ok: true, skipped: 'no matching tier' });
  }

  // Increment counts in KV + mark payment as processed (expire after 30 days)
  try {
    await Promise.all([
      ...Object.entries(updates).map(([key, qty]) => kv.incrby(key, qty)),
      kv.set(dedupKey, 1, { ex: 60 * 60 * 24 * 30 }),
    ]);
    console.log('[webhook] KV updated:', JSON.stringify(updates));
  } catch (err) {
    console.error('[webhook] KV write failed:', err.message);
    return res.status(500).json({ error: 'kv write failed', detail: err.message });
  }

  return res.status(200).json({ ok: true, updates });
}
