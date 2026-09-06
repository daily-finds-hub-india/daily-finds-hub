import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['172.16.140.69', '10.64.217.70', '192.168.1.33'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }]
  },
  reactCompiler: true
};

export default nextConfig;
