/**
 * =========================================================================
 * ROBOTICS CLUB UCE - CLUB MEMBERSHIP GOOGLE APPS SCRIPT BACKEND
 * =========================================================================
 * 
 * Instructions to set this up:
 * 1. Open Google Sheets (create a new sheet named e.g. "Robotics Club Memberships 2026").
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (Floppy icon).
 * 4. Replace SCREENSHOT_FOLDER_ID below with your Google Drive folder ID where screenshots will be saved:
 *    - To get the Folder ID: Create a folder in Google Drive (e.g. "Club Membership Payment Proofs"),
 *      open it, and copy the ID from the URL (the string after /folders/...).
 * 5. Click "Deploy" > "New deployment".
 *    - Select type: "Web app"
 *    - Description: "Robotics Club Membership API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so students can submit without logging in!)
 * 6. Click "Deploy", authorize permissions (Advanced > Go to script), and copy the Web App URL.
 * 7. Paste that Web App URL into `membership-registration.js` as `MEMBERSHIP_CONFIG.APPS_SCRIPT_URL`.
 * =========================================================================
 */

// Replace with your Google Drive Folder ID for payment screenshots
var SCREENSHOT_FOLDER_ID = "1odlN4jOmmlbbcwxyyLF-qEE7VY_87_KP";

/**
 * RUN THIS ONCE in the Apps Script Editor:
 * Select 'authorizeAndTestEmail' in the toolbar dropdown and click 'Run'.
 * Google will ask you to authorize permissions for sending emails.
 */
function authorizeAndTestEmail() {
  var myEmail = Session.getActiveUser().getEmail();
  MailApp.sendEmail({
    to: myEmail,
    subject: "Robotics Club UCE - Email Authorization Test",
    body: "If you receive this email, your Google Apps Script has been successfully authorized to send automated confirmation emails to students!"
  });
  Logger.log("Test email successfully sent to: " + myEmail);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 15 seconds to avoid spreadsheet write collisions
  try {
    lock.waitLock(15000);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Server busy, please retry in a moment." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "No data payload received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 1. Initialize Sheet Header if empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Membership Type",
        "Full Name",
        "Department",
        "Year / Semester",
        "WhatsApp Mobile",
        "Email Address",
        "Fee Paid (₹)",
        "Validity",
        "UPI Transaction ID / UTR",
        "Payment Screenshot Link",
        "Verification Status"
      ];
      sheet.appendRow(headers);

      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a"); // Dark slate
      headerRange.setFontColor("#ff4b8b"); // Cyber pink
      headerRange.setFontFamily("Consolas");
      sheet.setFrozenRows(1);
    }

    // 2. Handle Screenshot Upload to Google Drive (if present)
    var fileUrl = "No screenshot uploaded";
    if (data.fileData && data.fileData.trim() !== "") {
      try {
        var folder;
        if (SCREENSHOT_FOLDER_ID && SCREENSHOT_FOLDER_ID !== "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
          folder = DriveApp.getFolderById(SCREENSHOT_FOLDER_ID);
        } else {
          folder = DriveApp.getRootFolder();
        }

        var decoded = Utilities.base64Decode(data.fileData);
        var cleanName = (data.student.name || "Member").replace(/[^a-zA-Z0-9]/g, "_");
        var fileName = "MEMBERSHIP_" + cleanName + "_" + (data.upiUtr || "PROOF") + ".jpg";
        var blob = Utilities.newBlob(decoded, data.fileType || "image/jpeg", fileName);
        var file = folder.createFile(blob);

        // Make readable by link
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = file.getUrl();
      } catch (uploadErr) {
        fileUrl = "Upload failed: " + uploadErr.toString();
      }
    }

    // 3. Append Member Row
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var rowData = [
      timestamp,
      data.membershipTitle || "Robotics Club Lifetime College Pass",
      data.student.name || "",
      data.student.dept || "",
      data.student.year || "",
      "'" + (data.student.phone || ""), // Prefix with ' to preserve leading zeros in Excel/Sheets
      data.student.email || "",
      data.fee || 150,
      data.validity || "4-Year Lifetime (College Period)",
      "'" + (data.upiUtr || ""),
      fileUrl,
      "Pending Verification"
    ];

    sheet.appendRow(rowData);

    // 4. Send Instant Confirmation Email with WhatsApp Group Invite
    if (data.student && data.student.email && data.student.email.indexOf("@") !== -1) {
      try {
        var whatsappGroupLink = "https://chat.whatsapp.com/L4tIyy0RaSdG9xI6dLCzaF";
        var studentName = data.student.name || "Member";
        var studentDept = data.student.dept || "Engineering";
        var studentYear = data.student.year || "-";
        var upiUtr = data.upiUtr || "Recorded";
        
        var plainBody = "Hi " + studentName + ",\n\n" +
          "Thank you for registering for the Robotics Club Lifetime College Pass. Your registration details and payment of ₹150 have been recorded successfully.\n\n" +
          "Please join the official Member WhatsApp Group here:\n" + whatsappGroupLink + "\n\n" +
          "Registration Summary:\n" +
          "- Member Name: " + studentName + "\n" +
          "- Department: " + studentDept + "\n" +
          "- Semester / Year: " + studentYear + "\n" +
          "- UPI UTR: " + upiUtr + "\n" +
          "- Fee Paid: ₹150 (One-time, 4-Year Pass)\n\n" +
          "Warm regards,\nExecutive Committee\nRobotics Club · University College of Engineering (UCE)\nuceroboticsclub@gmail.com";

        var htmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 24px 12px; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 24px; border-bottom: 1px solid #f1f5f9;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #0284c7; text-transform: uppercase; display: block; margin-bottom: 6px;">
                    University College of Engineering
                  </span>
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                    Robotics Club UCE
                  </h1>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #64748b;">
                    Membership Registration Confirmation
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 28px 32px;">
                  <p style="margin: 0 0 16px; font-size: 15px; color: #0f172a; line-height: 1.6;">
                    Hi <strong>${studentName}</strong>,
                  </p>
                  <p style="margin: 0 0 24px; font-size: 14px; color: #334155; line-height: 1.65;">
                    Thank you for registering for the <strong>Robotics Club Lifetime College Pass</strong>. Your registration details and payment of <strong>₹150</strong> have been recorded successfully.
                  </p>

                  <!-- WhatsApp Invite Box -->
                  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 28px;">
                    <h2 style="margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #166534;">
                      Join the Member WhatsApp Group
                    </h2>
                    <p style="margin: 0 0 16px; font-size: 13px; color: #15803d; line-height: 1.5;">
                      All workshop announcements, hackathon updates, and project collaboration notices are shared exclusively in this group.
                    </p>
                    <a href="${whatsappGroupLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.02em;">
                      Join WhatsApp Group &rarr;
                    </a>
                  </div>

                  <!-- Details Summary Table -->
                  <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">
                    Registration Summary
                  </h3>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px 14px; color: #64748b; width: 40%;">Name</td>
                      <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${studentName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px 14px; color: #64748b;">Department</td>
                      <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${studentDept}</td>
                    </tr>
                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px 14px; color: #64748b;">Semester / Year</td>
                      <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${studentYear}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px 14px; color: #64748b;">UPI Transaction ID (UTR)</td>
                      <td style="padding: 10px 14px; font-family: monospace; font-weight: 600; color: #0f172a;">${upiUtr}</td>
                    </tr>
                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px 14px; color: #64748b;">Fee Paid</td>
                      <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">₹150 (One-time, 4-Year Pass)</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 14px; color: #64748b;">Verification Status</td>
                      <td style="padding: 10px 14px; font-weight: 600; color: #16a34a;">Under Verification</td>
                    </tr>
                  </table>

                  <!-- What's next list -->
                  <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #334155;">
                    What's next?
                  </p>
                  <ul style="margin: 0 0 24px; padding-left: 18px; font-size: 13px; color: #64748b; line-height: 1.7;">
                    <li>Your membership pass is valid for your entire stay at UCE (no annual renewals).</li>
                    <li>You are eligible for 50% discounts on upcoming hackathons and robotics workshops.</li>
                    <li>Please keep this email for your records.</li>
                  </ul>

                  <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                    Warm regards,<br>
                    <strong>Executive Committee</strong><br>
                    <span style="font-size: 13px; color: #64748b;">Robotics Club &middot; University College of Engineering (UCE)</span>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
                  <p style="margin: 0;">Have questions? Contact us at <a href="mailto:uceroboticsclub@gmail.com" style="color: #0284c7; text-decoration: none;">uceroboticsclub@gmail.com</a></p>
                  <p style="margin: 4px 0 0;">&copy; 2026 Robotics Club UCE. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        MailApp.sendEmail({
          to: data.student.email,
          subject: "🎉 Welcome to Robotics Club UCE! (Official Membership & WhatsApp Group)",
          name: "Robotics Club UCE",
          body: plainBody,
          htmlBody: htmlBody
        });
      } catch (emailErr) {
        // Log error but do not disrupt registration flow if email fails
        console.error("Confirmation email dispatch failed: " + emailErr.toString());
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Membership registration successful!",
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", service: "Robotics Club UCE Membership API" }))
    .setMimeType(ContentService.MimeType.JSON);
}
