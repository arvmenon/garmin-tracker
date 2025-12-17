import type { NextConfig } from "next";

// Next.js configuration tuned for the performance-first Garmin Tracker UI served on port 4010.
// Strict mode surfaces render issues early and the powered-by header is removed for leaner responses.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
