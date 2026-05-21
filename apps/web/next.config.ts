import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nova/api', '@nova/application', '@nova/domain', '@nova/ui'],
};

export default nextConfig;
