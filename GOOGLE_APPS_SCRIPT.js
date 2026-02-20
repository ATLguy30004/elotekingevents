// ============================================
// ELOTE KING WAITLIST — Google Apps Script
// ============================================
//
// SETUP INSTRUCTIONS:
// 1. Go to Google Sheets → create a new spreadsheet
// 2. Name it "Elote King Waitlist"
// 3. In Row 1, add headers: Email | Phone | Source | Timestamp
// 4. Go to Extensions → Apps Script
// 5. Delete everything in the editor and paste this entire file
// 6. Click Deploy → New Deployment
// 7. Select type: Web app
// 8. Execute as: Me
// 9. Who has access: Anyone
// 10. Click Deploy → copy the URL
// 11. Paste that URL into index.astro where it says YOUR_GOOGLE_SCRIPT_URL_HERE
//
// WHAT THIS DOES:
// - Saves every waitlist signup to your Google Sheet
// - Sends YOU an email notification for each signup
// - Sends the PERSON a confirmation email
// ============================================

// CHANGE THIS to your email
var OWNER_EMAIL = 'YOUR_EMAIL_HERE';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email;
    var phone = data.phone;
    var source = data.source || 'direct';
    var timestamp = data.timestamp || new Date().toISOString();

    // Save to spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([email, phone, source, timestamp]);

    // Get total count for the notification
    var totalSignups = sheet.getLastRow() - 1; // minus header row

    // Email YOU (Fahim) — notification
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: 'New Waitlist Signup #' + totalSignups + ' — Elote King Event #2',
      htmlBody: '<div style="font-family:sans-serif;max-width:500px;">' +
        '<h2 style="color:#16a34a;">New Waitlist Signup!</h2>' +
        '<p><strong>Email:</strong> ' + email + '</p>' +
        '<p><strong>Phone:</strong> ' + phone + '</p>' +
        '<p><strong>Source:</strong> ' + source + '</p>' +
        '<p><strong>Time:</strong> ' + timestamp + '</p>' +
        '<hr style="border:1px solid #eee;">' +
        '<p style="color:#888;">Total signups: <strong>' + totalSignups + '</strong></p>' +
        '</div>'
    });

    // Email THEM — confirmation
    MailApp.sendEmail({
      to: email,
      subject: "You're on the Elote King Event #2 Waitlist",
      htmlBody: '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;">' +
        '<div style="text-align:center;padding:20px;background:#111;border-radius:12px 12px 0 0;">' +
        '<h1 style="color:#fff;font-size:28px;margin:0;">ELOTE KING</h1>' +
        '<p style="color:#22c55e;margin:4px 0 0;font-size:14px;">100% Zabiha Halal Mexican Street Food</p>' +
        '</div>' +
        '<div style="padding:24px;background:#fff;border:1px solid #eee;border-radius:0 0 12px 12px;">' +
        '<h2 style="color:#111;font-size:22px;">You\'re on the list.</h2>' +
        '<p style="color:#333;font-size:16px;line-height:1.6;">You\'ll get first access to flights, pricing, and the full menu before anyone else.</p>' +
        '<div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:8px;padding:16px;margin:20px 0;">' +
        '<p style="margin:0;color:#111;font-weight:700;">What happens next:</p>' +
        '<p style="margin:8px 0 0;color:#333;">We\'ll text you at <strong>' + phone + '</strong> when early access opens on <strong>February 22</strong>.</p>' +
        '</div>' +
        '<p style="color:#555;font-size:14px;">Event #1 sold out in 48 hours. Being on this list means you don\'t miss out.</p>' +
        '<hr style="border:1px solid #eee;margin:20px 0;">' +
        '<p style="color:#999;font-size:13px;text-align:center;">Elote King Atlanta &bull; Alpharetta, GA 30004<br/>Questions? Reply to this email.</p>' +
        '</div>' +
        '</div>'
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      count: totalSignups
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'Elote King Waitlist API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
