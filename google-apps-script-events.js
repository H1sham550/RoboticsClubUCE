/**
 * =========================================================================
 * ROBOTICS CLUB UCE - EVENT REGISTRATION GOOGLE APPS SCRIPT BACKEND
 * =========================================================================
 * 
 * Instructions to set this up:
 * 1. Open Google Sheets (create a new sheet named e.g. "CTF 2026 Registrations").
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (Floppy icon).
 * 4. Replace FOLDER_ID below with your Google Drive folder ID where screenshots will be saved:
 *    - To get the Folder ID: Create a folder in Google Drive (e.g. "CTF 2026 Payment Proofs"),
 *      open it, and copy the ID from the URL (the string after /folders/...).
 * 5. Click "Deploy" > "New deployment".
 *    - Select type: "Web app"
 *    - Description: "Robotics Club Event Registration API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so students can submit without logging in!)
 * 6. Click "Deploy", authorize the permissions (Advanced > Go to script), and copy the Web App URL.
 * 7. Paste that Web App URL into `event-registration.js` as `EVENT_REG_CONFIG.APPS_SCRIPT_URL`.
 * =========================================================================
 */

// Replace with your Google Drive Folder ID for payment screenshots
var SCREENSHOT_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";

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
        "Event ID",
        "Event Name",
        "Team Name",
        "Membership Tier",
        "Total Fee (₹)",
        "Member 1 Name (Lead)",
        "Member 1 Dept",
        "Member 1 Year",
        "Member 1 Phone",
        "Member 1 Club Member",
        "Member 2 Name",
        "Member 2 Dept",
        "Member 2 Year",
        "Member 2 Phone",
        "Member 2 Club Member",
        "UPI UTR (12-Digit)",
        "Payment Screenshot Link",
        "Verification Status"
      ];
      sheet.appendRow(headers);

      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a"); // Dark slate
      headerRange.setFontColor("#00f5ff"); // Cyber cyan
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
          // Fallback: auto-locate or create a folder named "Robotics Club Event Proofs"
          var folders = DriveApp.getFoldersByName("Robotics Club Event Proofs");
          folder = folders.hasNext() ? folders.next() : DriveApp.createFolder("Robotics Club Event Proofs");
        }

        var decodedBytes = Utilities.base64Decode(data.fileData);
        var cleanTeamName = (data.teamName || "team").replace(/[^a-zA-Z0-9_-]/g, "_");
        var cleanUtr = (data.upiUtr || "proof").replace(/[^a-zA-Z0-9]/g, "");
        var fileName = cleanTeamName + "_" + cleanUtr + "_" + Date.now() + ".jpg";

        var blob = Utilities.newBlob(decodedBytes, data.fileType || "image/jpeg", fileName);
        var file = folder.createFile(blob);
        // Set sharing to anyone with the link so organizers can view screenshots easily
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = file.getUrl();
      } catch (uploadErr) {
        fileUrl = "Upload error: " + uploadErr.toString();
      }
    }

    // 3. Format and Append New Registration Row
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var m1 = data.member1 || {};
    var m2 = data.member2 || {};

    sheet.appendRow([
      timestamp,
      data.eventId || "general",
      data.eventName || "Event",
      data.teamName || "N/A",
      data.membershipType || "",
      data.feeTotal || 0,
      m1.name || "",
      m1.dept || "",
      m1.year || "",
      m1.phone || "",
      m1.isMember ? "YES" : "NO",
      m2.name || "",
      m2.dept || "",
      m2.year || "",
      m2.phone || "",
      m2.isMember ? "YES" : "NO",
      data.upiUtr || "",
      fileUrl,
      "Pending Verification"
    ]);

    // 4. Return Success Output
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Registration successful!",
        fileUrl: fileUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Simple healthcheck / GET test
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "Robotics Club UCE Event Registration Web App is live."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
