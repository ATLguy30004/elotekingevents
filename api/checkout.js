import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { items } = body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!token || !locationId) {
    console.error('[checkout] Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const line_items = items.map(item => ({
    name: item.name,
    quantity: String(item.quantity || 1),
    base_price_money: {
      amount: Math.round(item.price * 100),
      currency: 'USD',
    },
  }));

  const idempotency_key = crypto.randomUUID();

  try {
    const response = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key,
        order: {
          location_id: locationId,
          line_items,
        },
        checkout_options: {
          redirect_url: 'https://events.elotekingatlanta.com/confirmed',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[checkout] Square API error:', JSON.stringify(data));
      return res.status(502).json({ error: 'Payment link creation failed' });
    }

    return res.status(200).json({ url: data.payment_link.url });
  } catch (err) {
    console.error('[checkout] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
