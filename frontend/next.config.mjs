/** @type {import('next').NextConfig} */
// BACKEND_URL (no NEXT_PUBLIC_ prefix) is evaluated at runtime by Next.js
// for server-side rewrites, so it works correctly on Vercel without
// needing to rebuild when the backend URL changes.
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
