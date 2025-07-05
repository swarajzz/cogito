const nextConfig = {
  experimental: {
    optimizePackageImports: ['d3', 'lucide-react'],
  },
  transpilePackages: ['d3'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
