// frontend/next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This block tells Vercel to ignore ESLint errors during the build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;