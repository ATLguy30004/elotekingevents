// ============================================================
// ELOTE KING EVENT #2 — Square Orders Handler
// Google Apps Script — Web App (doPost)
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Go to Google Sheets → create a new spreadsheet
// 2. Name it "Elote King Event #2 — Orders"
// 3. In Row 1, add headers (exactly):
//    Timestamp | Name | Email | Tier | Amount | Order ID | Square Payment ID
// 4. Go to Extensions → Apps Script
// 5. Delete everything and paste this entire file
// 6. Click Deploy → New Deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Click Deploy → copy the Web App URL
// 8. In Square Dashboard → Developers → Webhooks → Add endpoint
//    - Paste that URL
//    - Subscribe to: payment.completed
// 9. Fill in OWNER_EMAIL and SQUARE_SIGNATURE_KEY below
// ============================================================

var OWNER_EMAIL    = 'YOUR_EMAIL_HERE';              // Your email (Fahim)
var SQUARE_SIG_KEY = 'YOUR_SQUARE_WEBHOOK_SIG_KEY';  // From Square → Developers → Webhooks → Signature key

// Tier lookup by amount in cents
var TIERS = {
  1499: 'The Taste',
  3699: "King's Table",
  6499: 'Royal Feast'
};

// ============================================================
// MAIN — Square sends POST here on every payment.completed
// ============================================================
function doPost(e) {
  try {
    var raw  = e.postData.contents;
    var body = JSON.parse(raw);

    // Only handle payment.completed events
    if (body.type !== 'payment.completed') {
      return ok('ignored: ' + body.type);
    }

    var payment = body.data.object.payment;
    var amountCents = payment.amount_money ? payment.amount_money.amount : 0;
    var tier        = TIERS[amountCents] || ('Unknown ($' + (amountCents / 100).toFixed(2) + ')');
    var amountDollars = '$' + (amountCents / 100).toFixed(2);
    var name        = getNameFromPayment(payment);
    var email       = payment.buyer_email_address || '';
    var orderId     = payment.order_id || '';
    var paymentId   = payment.id || '';
    var timestamp   = new Date().toISOString();

    // --- Log to Google Sheet ---
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([timestamp, name, email, tier, amountDollars, orderId, paymentId]);
    var totalOrders = sheet.getLastRow() - 1;

    // --- Email Fahim ---
    if (email || name) {
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: '💳 New Order #' + totalOrders + ' — ' + tier + ' — Elote King Event #2',
        htmlBody: buildOwnerEmail(name, email, tier, amountDollars, orderId, totalOrders, timestamp)
      });
    }

    // --- Email the buyer ---
    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: '✅ You\'re In — Elote King Event #2 Confirmed',
        htmlBody: buildBuyerEmail(name, tier, amountDollars, orderId)
      });
    }

    return ok('processed');

  } catch (err) {
    // Log the error and return 200 so Square doesn't retry
    Logger.log('ERROR: ' + err.toString());
    return ok('error: ' + err.toString());
  }
}

// ============================================================
// HELPERS
// ============================================================
function getNameFromPayment(payment) {
  if (payment.billing_address) {
    var first = payment.billing_address.first_name || '';
    var last  = payment.billing_address.last_name  || '';
    return (first + ' ' + last).trim();
  }
  return 'Guest';
}

function ok(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// WHAT THEY GET — per tier
// ============================================================
var TIER_DETAILS = {
  'The Taste':     'Pick 1 main (Burger, Taquitos, or Loaded Fries) + 1 Drink + 1 Esquite Cup',
  "King's Table":  'Pick 2 mains + 2 Drinks + 2 Esquite Cups',
  'Royal Feast':   'All 3 mains + 3 Drinks + 3 Esquite Cups + Gold Flan Royale included'
};

// ============================================================
// OWNER NOTIFICATION EMAIL
// ============================================================
function buildOwnerEmail(name, email, tier, amount, orderId, total, timestamp) {
  return '<div style="font-family:sans-serif;max-width:520px;">' +
    '<div style="background:#111;padding:16px 20px;border-radius:10px 10px 0 0;">' +
    '<h2 style="color:#16a34a;margin:0;font-size:20px;">💳 New Order — Elote King Event #2</h2>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:0 0 10px 10px;padding:20px;">' +
    '<table style="width:100%;border-collapse:collapse;font-size:15px;">' +
    '<tr><td style="padding:8px 0;color:#555;width:40%;">Name</td><td style="padding:8px 0;font-weight:700;color:#111;">' + (name || '—') + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#555;border-top:1px solid #f0f0f0;">Email</td><td style="padding:8px 0;font-weight:700;color:#111;border-top:1px solid #f0f0f0;">' + (email || '—') + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#555;border-top:1px solid #f0f0f0;">Tier</td><td style="padding:8px 0;font-weight:700;color:#16a34a;border-top:1px solid #f0f0f0;">' + tier + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#555;border-top:1px solid #f0f0f0;">Amount</td><td style="padding:8px 0;font-weight:700;color:#111;border-top:1px solid #f0f0f0;">' + amount + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#555;border-top:1px solid #f0f0f0;">Order ID</td><td style="padding:8px 0;color:#888;font-size:13px;border-top:1px solid #f0f0f0;">' + (orderId || '—') + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#555;border-top:1px solid #f0f0f0;">Time</td><td style="padding:8px 0;color:#888;font-size:13px;border-top:1px solid #f0f0f0;">' + timestamp + '</td></tr>' +
    '</table>' +
    '<div style="background:#f0fdf4;border:1px solid #16a34a;border-radius:8px;padding:12px 16px;margin-top:16px;text-align:center;">' +
    '<strong style="color:#111;font-size:16px;">Total orders so far: ' + total + ' of 60</strong>' +
    '</div>' +
    '</div>' +
    '</div>';
}

// ============================================================
// BUYER CONFIRMATION EMAIL
// ============================================================
function buildBuyerEmail(name, tier, amount, orderId) {
  var details = TIER_DETAILS[tier] || tier;
  var firstName = name ? name.split(' ')[0] : 'Friend';
  return '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;">' +

    // Header
    '<div style="background:#111111;padding:20px;text-align:center;border-radius:12px 12px 0 0;">' +
    '<h1 style="color:#ffffff;font-size:30px;margin:0;letter-spacing:2px;">ELOTE KING</h1>' +
    '<p style="color:#16a34a;margin:4px 0 0;font-size:13px;font-weight:600;">100% ZABIHA HALAL • MUSLIM-OWNED • ZERO ALCOHOL</p>' +
    '</div>' +

    // Body
    '<div style="background:#ffffff;border:1px solid #eeeeee;border-radius:0 0 12px 12px;padding:28px 24px;">' +

    // Confirmation
    '<div style="text-align:center;margin-bottom:24px;">' +
    '<div style="display:inline-block;background:#16a34a;color:#fff;border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;text-align:center;">✓</div>' +
    '<h2 style="color:#111;font-size:24px;margin:12px 0 4px;">You\'re In, ' + firstName + '.</h2>' +
    '<p style="color:#16a34a;font-weight:700;font-size:16px;margin:0;">Your food is guaranteed.</p>' +
    '</div>' +

    // What you got
    '<div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:10px;padding:16px 20px;margin-bottom:20px;">' +
    '<p style="margin:0 0 4px;font-size:13px;color:#555;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Your Flight</p>' +
    '<p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#111;">' + tier + ' — ' + amount + '</p>' +
    '<p style="margin:0;font-size:14px;color:#333;line-height:1.6;">' + details + '</p>' +
    '</div>' +

    // Event details
    '<div style="border:1px solid #eeeeee;border-radius:10px;padding:16px 20px;margin-bottom:20px;">' +
    '<p style="margin:0 0 12px;font-size:15px;font-weight:800;color:#111;">Event Details</p>' +
    '<p style="margin:0 0 8px;font-size:15px;color:#333;">📅 <strong>Friday, February 27, 2026 at 9:30 PM</strong></p>' +
    '<p style="margin:0 0 8px;font-size:15px;color:#333;">📍 <strong>Creative Labs</strong><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6180 Atlanta Hwy, Alpharetta, GA 30004</p>' +
    '<p style="margin:0;font-size:15px;color:#333;">🌮 100% Zabiha Halal • Zero Alcohol</p>' +
    '</div>' +

    // Instructions
    '<div style="border:1px solid #eeeeee;border-radius:10px;padding:16px 20px;margin-bottom:20px;">' +
    '<p style="margin:0 0 12px;font-size:15px;font-weight:800;color:#111;">Before You Go</p>' +
    '<p style="margin:0 0 8px;font-size:14px;color:#333;">⏰ Arrive by 9:30 PM — food service starts on time</p>' +
    '<p style="margin:0 0 8px;font-size:14px;color:#333;">📱 Show this email OR your Square receipt at the door</p>' +
    '<p style="margin:0 0 8px;font-size:14px;color:#333;">🍮 Add-ons (flan, extra drinks) available for purchase on-site</p>' +
    '<p style="margin:0;font-size:14px;color:#333;">📸 Tag us <strong>@elotekingatlanta</strong> — we repost the best shots</p>' +
    '</div>' +

    // Order ref
    '<p style="font-size:12px;color:#aaa;text-align:center;margin-bottom:20px;">Order ID: ' + (orderId || 'See Square receipt') + '</p>' +

    // Transfer policy
    '<div style="background:#fff8f0;border:1px solid #f59e0b;border-radius:8px;padding:12px 16px;margin-bottom:20px;">' +
    '<p style="margin:0;font-size:13px;color:#555;line-height:1.6;"><strong style="color:#111;">Non-refundable, fully transferable.</strong> Can\'t make it? Send a friend or hold credit toward Event #3. Text us at <a href="tel:16782088774" style="color:#16a34a;font-weight:700;">678-208-8774</a> before Feb 26.</p>' +
    '</div>' +

    // Footer
    '<hr style="border:none;border-top:1px solid #eee;margin:0 0 16px;" />' +
    '<p style="text-align:center;font-size:13px;color:#999;margin:0;">Elote King Atlanta &bull; Alpharetta, GA 30004<br/>Questions? Reply to this email or text <a href="tel:16782088774" style="color:#16a34a;">678-208-8774</a></p>' +
    '</div>' +
    '</div>';
}

// ============================================================
// GET — health check (Square will ping this to verify)
// ============================================================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', service: 'Elote King Orders API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
