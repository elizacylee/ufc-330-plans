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
var TIME_ZONE   = "America/Los_Angeles";   // times are shown in this zone
var TIME_FORMAT = "MMM d, yyyy  h:mm:ss a"; // 12-hour clock, e.g. "Aug 15, 2026  3:45:12 PM"

function fmtTime(date) {
  return Utilities.formatDate(date, TIME_ZONE, TIME_FORMAT);
}

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

    // Fold her heartfelt answers (clarity / date / next-step) into the plan cell.
    var plan = d.plan || "";
    if (d.notes) plan += (plan ? "   ||   " : "") + d.notes;

    // Write the time as a 12-hour text string so it never shows in 24-hour form.
    sheet.appendRow([
      fmtTime(new Date()),
      d.by || "",
      d.session || "",
      d.type || "",
      path,
      plan,
      d.node || ""
    ]);

    // Email you when she reaches a final answer (a yes, or anything that wasn't a yes).
    if (d.type === "yes" || d.type === "no") {
      var verdict = d.type === "yes" ? "YES ✅ — it's a date" : "her answer (not a yes)";
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "UFC 330 Plans: " + verdict + " (" + (d.by || "her") + ")",
        "Final answer: " + (d.answer || verdict) + "\n\n" +
        "The plan she built: " + (d.plan || "(n/a)") + "\n" +
        "Where she stands / next step: " + (d.notes || "(n/a)") + "\n" +
        "Full path: " + path + "\n" +
        "Tag: " + (d.by || "her") + "\n" +
        "Time: " + fmtTime(new Date())
      );
    }

    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  }
}
