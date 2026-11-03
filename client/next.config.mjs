/** @type {import('next').NextConfig} */
const nextConfig = {
  // Browser -> /backend/* -> Express /api/*. Keeps the HTTPOnly JWT cookie first-party.
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${process.env.API_URL || "http://localhost:5000"}/api/:path*` }];
  },
};
export default nextConfig;
