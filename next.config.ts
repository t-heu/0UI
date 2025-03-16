import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Modo estrito do React
  output: 'export',
  images: {
    unoptimized: true, // Disable image optimization
  },
};

export default nextConfig;
