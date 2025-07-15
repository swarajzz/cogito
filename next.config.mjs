const nextConfig = {
  experimental: {
    optimizePackageImports: ["d3", "lucide-react"],
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
