import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Required for @react-pdf/renderer to work in serverless
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
