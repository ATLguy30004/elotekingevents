const puppeteer = require('puppeteer');
const path = require('path');

const cards = [
  {
    file: 'square-card-taste.png',
    title: 'THE TASTE',
    subtitle: 'Your First Bite of the King',
    crowns: '👑',
    tier: 'TIER 1',
    prepay: '$14.99',
    door: '$22.99',
    save: 'SAVE $8',
    items: ['Pick 1 Main:', '• King Smash Burger + fries', '• Taquito Michelada — 5 chicken taquitos', '• Chorizo (Ground Beef) Loaded Fries', '', '+ 1 Drink  +  1 Esquite Cup'],
    extra: '+ Gold Flan Royale add-on: $8',
    value: '$26 a la carte value',
    topBg: '#0f2010',
    accentColor: '#16a34a',
    popular: false,
  },
  {
    file: 'square-card-kings.png',
    title: "THE KING'S TABLE",
    subtitle: 'The One You Actually Want',
    crowns: '👑👑',
    tier: 'TIER 2 — MOST POPULAR',
    prepay: '$36.99',
    door: '$44.99',
    save: 'SAVE $8',
    items: ['Pick 2 Mains:', '• King Smash Burger + fries', '• Taquito Michelada — 5 chicken taquitos', '• Chorizo (Ground Beef) Loaded Fries', '', '+ 2 Drinks  +  2 Esquite Cups'],
    extra: '+ Gold Flan Royale add-on: $8',
    value: '$52 a la carte value',
    topBg: '#0a1a0a',
    accentColor: '#16a34a',
    popular: true,
  },
  {
    file: 'square-card-royal.png',
    title: 'THE ROYAL FEAST',
    subtitle: 'You + Your Crew Eat Like Kings (3–4 People)',
    crowns: '👑👑👑',
    tier: 'TIER 3 — VIP',
    prepay: '$64.99',
    door: '$74.99',
    save: 'SAVE $10',
    items: ['Everything Included:', '• King Smash Burger + fries', '• Taquito Michelada — 5 chicken taquitos', '• Chorizo (Ground Beef) Loaded Fries', '', '+ 3 Drinks  +  3 Esquite Cups  +  Flan ✓'],
    extra: 'Gold Flan Royale INCLUDED — no add-on needed',
    value: '$86 a la carte value',
    topBg: '#1a1408',
    accentColor: '#d4a017',
    popular: false,
  }
];

function buildHTML(card) {
  const popularBanner = card.popular
    ? `<div style="background:#16a34a;color:#fff;text-align:center;padding:18px;font-size:22px;font-weight:900;letter-spacing:3px;">⭐ MOST POPULAR — BEST VALUE ⭐</div>`
    : '';

  const itemsHTML = card.items.map(item => {
    if (item === '') return `<div style="height:12px;"></div>`;
    if (item.endsWith(':')) return `<div style="font-size:20px;font-weight:800;color:#aaa;margin-bottom:4px;">${item}</div>`;
    return `<div style="font-size:22px;color:#fff;font-weight:600;padding:5px 0;">${item}</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1000px; height:1000px; background:#111; font-family:'DM Sans',sans-serif; overflow:hidden; }
</style>
</head>
<body>
<div style="width:1000px;height:1000px;background:#111;display:flex;flex-direction:column;">

  ${popularBanner}

  <!-- TOP SECTION -->
  <div style="background:${card.topBg};padding:36px 48px 28px;text-align:center;flex-shrink:0;">
    <!-- Brand -->
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px;">
      <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#fff;letter-spacing:4px;">ELOTE KING</span>
      <span style="background:#16a34a;color:#fff;font-size:13px;font-weight:800;padding:4px 12px;border-radius:5px;letter-spacing:1px;">ZABIHA HALAL</span>
    </div>
    <!-- Crown + Tier -->
    <div style="font-size:48px;line-height:1;margin-bottom:4px;">${card.crowns}</div>
    <div style="font-size:14px;font-weight:800;color:#888;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">${card.tier}</div>
    <!-- Title -->
    <div style="font-family:'Bebas Neue',sans-serif;font-size:72px;color:#fff;line-height:1;letter-spacing:2px;">${card.title}</div>
    <div style="font-size:18px;color:${card.accentColor};font-weight:600;margin-top:4px;margin-bottom:20px;">${card.subtitle}</div>
    <!-- Price -->
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;">
      <div style="text-align:left;">
        <div style="font-size:13px;font-weight:800;color:#888;letter-spacing:2px;margin-bottom:2px;">★ PRE-PAY</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:80px;color:${card.accentColor};line-height:1;">${card.prepay}</div>
      </div>
      <div style="text-align:left;">
        <div style="font-size:15px;color:#555;text-decoration:line-through;margin-bottom:4px;">${card.door} at door</div>
        <div style="background:${card.accentColor};color:#fff;font-size:14px;font-weight:900;padding:5px 14px;border-radius:5px;letter-spacing:1px;">${card.save}</div>
      </div>
    </div>
  </div>

  <!-- EVENT BAR -->
  <div style="background:#0a0a0a;padding:12px 48px;text-align:center;font-size:17px;font-weight:700;color:#888;flex-shrink:0;">
    <span style="color:#16a34a;">Fri Feb 27, 2026</span> &nbsp;•&nbsp; 9:30 PM &nbsp;•&nbsp; Creative Labs, Alpharetta GA
  </div>

  <!-- ITEMS -->
  <div style="padding:24px 48px;flex:1;">
    ${itemsHTML}
    <div style="margin-top:16px;background:#1a1a1a;border:1px dashed #333;border-radius:10px;padding:14px 20px;font-size:19px;color:#aaa;font-weight:600;">${card.extra}</div>
    <div style="margin-top:12px;background:rgba(${card.accentColor === '#16a34a' ? '22,163,74' : '212,160,23'},0.1);border:1px solid ${card.accentColor};border-radius:10px;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:17px;color:#888;font-weight:600;">A la carte value:</span>
      <span style="font-size:26px;font-weight:900;color:${card.accentColor};">${card.value.split(' ')[0]}</span>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#0a0a0a;padding:16px 48px;text-align:center;flex-shrink:0;">
    <div style="font-size:16px;font-weight:700;color:#555;letter-spacing:1px;">✓ 100% Zabiha Halal &nbsp;•&nbsp; Muslim-Owned &nbsp;•&nbsp; Zero Alcohol &nbsp;•&nbsp; Alpharetta, GA</div>
  </div>

</div>
</body>
</html>`;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const outputDir = path.join(__dirname, 'public', 'images');

  for (const card of cards) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 2 });
    await page.setContent(buildHTML(card), { waitUntil: 'networkidle0' });
    const outPath = path.join(outputDir, card.file);
    await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1000, height: 1000 } });
    console.log('✓ Generated:', card.file);
    await page.close();
  }

  await browser.close();
  console.log('\nAll 3 cards saved to public/images/');
})();
