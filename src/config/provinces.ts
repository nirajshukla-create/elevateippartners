export interface Province {
  id: string;
  name: string;
  programName: string;
  externalUrl: string;
}

// Ordered alphabetically by English province name (Alberta → Yukon).
// Display names are resolved from dict.provinceNames[id] for bilingual support.
export const PROVINCES: Province[] = [
  { id: "AB", name: "Alberta",                   programName: "ElevateIP Alberta",      externalUrl: "https://elevateip-ab.com/" },
  { id: "BC", name: "British Columbia",          programName: "AccelerateIP",            externalUrl: "https://www.accelerateip.ca/" },
  { id: "MB", name: "Manitoba",                  programName: "ElevateIP",               externalUrl: "https://elevate-ip.ca/" },
  { id: "NB", name: "New Brunswick",             programName: "Atlantic IP Advantage",   externalUrl: "https://springboardatlantic.ca/ipadvantage/" },
  { id: "NL", name: "Newfoundland and Labrador", programName: "Atlantic IP Advantage",   externalUrl: "https://springboardatlantic.ca/ipadvantage/" },
  { id: "NT", name: "Northwest Territories",     programName: "AccelerateIP",            externalUrl: "https://www.accelerateip.ca/" },
  { id: "NS", name: "Nova Scotia",               programName: "Atlantic IP Advantage",   externalUrl: "https://springboardatlantic.ca/ipadvantage/" },
  { id: "NU", name: "Nunavut",                   programName: "AccelerateIP",            externalUrl: "https://www.accelerateip.ca/" },
  { id: "ON", name: "Ontario",                   programName: "ElevateIP",               externalUrl: "https://elevate-ip.ca/" },
  { id: "PE", name: "Prince Edward Island",      programName: "Atlantic IP Advantage",   externalUrl: "https://springboardatlantic.ca/ipadvantage/" },
  { id: "QC", name: "Quebec",                    programName: "MomentumPI",              externalUrl: "https://mainqc.com/en/intellectual-property-support/" },
  { id: "SK", name: "Saskatchewan",              programName: "ElevateIP",               externalUrl: "https://elevate-ip.ca/" },
  { id: "YT", name: "Yukon",                     programName: "AccelerateIP",            externalUrl: "https://www.accelerateip.ca/" },
];
