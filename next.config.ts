import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wordpress-1518583-5839077.cloudwaysapps.com",
      },
      {
        protocol: "http",
        hostname: "wordpress-1518583-5839077.cloudwaysapps.com",
      },
    ],
  },
};

export default nextConfig;