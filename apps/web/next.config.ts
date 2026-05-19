import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nova/api', '@nova/domain'],
};

export default nextConfig;
