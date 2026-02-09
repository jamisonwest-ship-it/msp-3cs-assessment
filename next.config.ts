import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://127.0.0.1:3001"],
  webpack: (config) => {
    // Required for @react-pdf/renderer to work in serverless
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
