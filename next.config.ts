import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.studying-in-uk.org',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'pix1.agoda.net'
      },
      {
        protocol: 'http',
        hostname: 'pix2.agoda.net'
      },
      {
        protocol: 'http',
        hostname: 'pix3.agoda.net'
      },
      {
        protocol: 'http',
        hostname: 'pix4.agoda.net'
      },
      {
        protocol: 'http',
        hostname: 'pix5.agoda.net'
      }
    ]
  },
  env:{
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    TOM_TOM_KEY: process.env.TOM_TOM_KEY,
    MAPTILER_API_KEY: process.env.MAPTILER_API_KEY
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
