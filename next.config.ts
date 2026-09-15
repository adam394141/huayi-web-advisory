import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 82],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rhkmzcyfzemlobznltyz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "huayi.tw",
        pathname: "/upload/**",
      },
    ],
  },
};

export default nextConfig;
