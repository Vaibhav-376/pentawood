import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/pages/about",
      },
      {
        source: "/faq",
        destination: "/pages/faq",
      },
      {
        source: "/shipping",
        destination: "/pages/shipping",
      },
      {
        source: "/terms",
        destination: "/pages/terms",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/collections/sale",
        destination: "/collections",
        permanent: false,
      },
      {
        source: "/pages/contact",
        destination: "/contact",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
