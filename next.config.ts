import type { NextConfig } from "next";

const CIPO_EVENTS_URL =
  "https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/ip-central#events-section";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  async redirects() {
    return [
      // Temporary redirect — events page preserved but not yet publicly launched.
      // Remove this rule when the internal calendar goes live.
      {
        source: "/:lang/events",
        destination: CIPO_EVENTS_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
