import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "assets.banksaqu.co.id",
      },
      {
        // Allow all external images (wildcard)
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
