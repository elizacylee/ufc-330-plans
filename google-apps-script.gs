/**
 * The Plan Picker — answer logger
 * ---------------------------------
 * This runs inside a Google Sheet (Extensions > Apps Script).
 * It receives every answer from the questionnaire, writes it as a row,
 * and emails you the moment someone gives a final yes or no.
 *
 * SETUP: see SETUP.md. In short:
 *   1. Make a new Google Sheet.
 *   2. Extensions > Apps Script, delete the sample, paste ALL of this.
 *   3. Put your email in NOTIFY_EMAIL below.
 *   4. Deploy > New deployment > Web app > Execute as: Me,
 *      Who has access: Anyone > Deploy. Copy the /exec URL.
 *   5. Paste that URL into CONFIG.logEndpoint in date-decider.html.
 */

var NOTIFY_EMAIL = "eliizaleee@gmail.com"; // <-- change to where you want the alert email

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Responses");
    if (!sheet) {
      sheet = ss.insertSheet("Responses");
      sheet.appendRow(["Time", "Who", "Session", "Event", "Path so far", "Plan", "Stopped at"]);
    }

    var d = JSON.parse(e.postData.contents);
    var path = (d.chips || []).join("  >  ");

    sheet.appendRow([
      new Date(),
      d.by || "",
      d.session || "",
      d.type || "",
      path,
      d.plan || "",
      d.node || ""
    ]);

    // Email you on a final decision.
    if (d.type === "yes" || d.type === "no") {
      var verdict = d.type === "yes" ? "YES ✅ — it's a date" : "no ❌";
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "Plan Picker: " + verdict + " (" + (d.by || "her") + ")",
        "Answer: " + verdict + "\n\n" +
        "Plan she built: " + (d.plan || "(n/a)") + "\n" +
        "Path: " + path + "\n" +
        "Tag: " + (d.by || "her") + "\n" +
        "Time: " + new Date()
      );
    }

    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  }
}
