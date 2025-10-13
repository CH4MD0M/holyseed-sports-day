import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [375, 414, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wecycpskwumzybcvgaka.supabase.co',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // PWA 준비
  reactStrictMode: true,

  // 모바일 최적화
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
