import { google } from "googleapis";
import { NextRequest } from "next/server";

const SHEET_ID = process.env.EVENTS_SHEET_ID ?? "";
const RANGE    = "Events!A:J";

function sheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key:  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

export async function POST(req: NextRequest) {
  if (!SHEET_ID) {
    return Response.json({ error: "Sheet not configured" }, { status: 500 });
  }
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ) {
    return Response.json({ error: "Service account not configured" }, { status: 500 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, event_date, description, partner_name, partner_logo_url, registration_url } = body;

  if (!title?.trim() || !event_date?.trim() || !partner_name?.trim()) {
    return Response.json({ error: "title, event_date, and partner_name are required" }, { status: 400 });
  }

  // Match column order in the sheet:
  // approval_status | event_date | title | description | partner_name | partner_logo_url | registration_url
  const row = [
    "Pending",
    event_date.trim(),
    title.trim(),
    description?.trim() ?? "",
    partner_name.trim(),
    partner_logo_url?.trim() ?? "",
    registration_url?.trim() ?? "",
  ];

  try {
    const sheets = sheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });
  } catch (err) {
    console.error("[submit-event] Sheets API error:", err);
    return Response.json({ error: "Failed to save event" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
