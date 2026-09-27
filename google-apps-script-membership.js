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
