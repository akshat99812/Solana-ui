import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  eslint: {
      ignoreDuringBuilds: true, // ✅ disable linting during `next build`
    },
    typescript:{
      ignoreBuildErrors:true,
    },
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'arweave.net',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.arweave.net',
          port: '',
          pathname: '/**',
        },
      ],
    },
  
};

export default nextConfig;
