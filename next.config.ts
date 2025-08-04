import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["d3", "lucide-react"],
    staleTimes: {
      dynamic: 3600,
      static: 86400,
    },
    cacheComponents: true,
    // cacheLife: {
    //   custom: {
    //     stale: 5,
    //     revalidate: 10,
    //     expire: 1
    //   }
    // }
  },
  transpilePackages: ["d3"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/home",
        destination: "/",
      },
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
};

export default nextConfig;
