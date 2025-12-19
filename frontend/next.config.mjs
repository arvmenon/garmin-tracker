// Next.js configuration tuned for the performance-first Garmin Tracker UI served on port 4010.
// Strict mode surfaces render issues early and the powered-by header is removed for leaner responses.
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
