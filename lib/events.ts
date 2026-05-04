export interface CalendarEvent {
  id: string;
  date: string;             // ISO YYYY-MM-DD
  title: string;
  title_fr?: string;
  description: string;
  description_fr?: string;
  partner_name: string;
  partner_logo_url: string;
  registration_url: string;
}

const SHEET_ID = process.env.EVENTS_SHEET_ID ?? "";
const API_KEY  = process.env.GOOGLE_SHEETS_API_KEY ?? "";
// Adjust the range to match your sheet tab name and column extent.
const RANGE    = "Events!A1:J1000";

const DUMMY_EVENTS: CalendarEvent[] = [
  {
    id: "dummy-1",
    date: "2026-05-08",
    title: "IP 101: Protecting Your Startup's Core Assets",
    description: "An introductory webinar covering patents, trademarks, and trade secrets for early-stage founders.",
    partner_name: "Communitech",
    partner_logo_url: "",
    registration_url: "#",
  },
  {
    id: "dummy-2",
    date: "2026-05-15",
    title: "Trademark Strategy for Consumer Brands",
    description: "Learn how to build a defensible brand identity and navigate the trademark registration process in Canada and the US.",
    partner_name: "Invest Ottawa",
    partner_logo_url: "",
    registration_url: "#",
  },
  {
    id: "dummy-3",
    date: "2026-05-22",
    title: "IP Due Diligence: What Investors Look For",
    description: "A clinic with IP lawyers walking through what a VC's legal team checks before a Series A — and how to be ready.",
    partner_name: "New Ventures BC",
    partner_logo_url: "",
    registration_url: "#",
  },
  {
    id: "dummy-4",
    date: "2026-06-03",
    title: "Open Source & IP: Navigating the Grey Zones",
    description: "Practical guidance on using open-source software in commercial products without compromising your IP position.",
    partner_name: "North Forge",
    partner_logo_url: "",
    registration_url: "#",
  },
  {
    id: "dummy-5",
    date: "2026-06-11",
    title: "Patent Filing Workshop — Atlantic Canada",
    description: "Hands-on workshop covering provisional patents, PCT filings, and Canadian patent prosecution timelines.",
    partner_name: "Springboard Atlantic",
    partner_logo_url: "",
    registration_url: "#",
  },
  {
    id: "dummy-6",
    date: "2026-06-19",
    title: "IP Licensing & Revenue Streams",
    description: "Explore how to monetize your IP through licensing deals, royalty structures, and strategic partnerships.",
    partner_name: "Innovate Calgary",
    partner_logo_url: "",
    registration_url: "#",
  },
  {
    id: "dummy-7",
    date: "2026-07-10",
    title: "Trade Secrets in the Age of Remote Work",
    description: "How to protect confidential business information when your team is distributed and using cloud tools.",
    partner_name: "MAIN",
    partner_logo_url: "",
    registration_url: "#",
  },
];

export async function fetchApprovedEvents(): Promise<CalendarEvent[]> {
  if (!SHEET_ID || !API_KEY) {
    console.warn("[events] EVENTS_SHEET_ID or GOOGLE_SHEETS_API_KEY is not configured — using dummy data");
    return DUMMY_EVENTS;
  }

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/` +
    `${encodeURIComponent(RANGE)}?key=${API_KEY}`;

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: 3600, tags: ["events"] },
    });
  } catch (err) {
    console.error("[events] Network error fetching Google Sheet:", err);
    return [];
  }

  if (!res.ok) {
    console.error(`[events] Sheets API error ${res.status}: ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as { values?: string[][] };
  const rows = json.values ?? [];

  if (rows.length < 2) return [];

  // Normalise header names: lowercase + underscores, trim whitespace.
  const headers = rows[0].map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_")
  );

  const col = (name: string) => headers.indexOf(name);

  const approvalCol    = col("approval_status");
  const dateCol        = col("event_date");
  const titleCol       = col("title");
  const titleFrCol     = col("title_fr");
  const descCol        = col("description");
  const descFrCol      = col("description_fr");
  const partnerNameCol = col("partner_name");
  const partnerLogoCol = col("partner_logo_url");
  const regUrlCol      = col("registration_url");

  const events: CalendarEvent[] = rows
    .slice(1)
    .filter((row) => row[approvalCol]?.trim() === "Approved")
    .map((row, i) => ({
      id:               `event-${i}`,
      date:             normalizeDate(row[dateCol] ?? ""),
      title:            row[titleCol]?.trim() ?? "",
      title_fr:         row[titleFrCol]?.trim() || undefined,
      description:      row[descCol]?.trim() ?? "",
      description_fr:   row[descFrCol]?.trim() || undefined,
      partner_name:     row[partnerNameCol]?.trim() ?? "",
      partner_logo_url: row[partnerLogoCol]?.trim() ?? "",
      registration_url: row[regUrlCol]?.trim() ?? "",
    }))
    .filter((e) => e.date && e.title)
    .sort((a, b) => a.date.localeCompare(b.date));

  return events;
}

// Accepts YYYY-MM-DD (passthrough), MM/DD/YYYY, and JS-parseable strings.
function normalizeDate(raw: string): string {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
}
